/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {

    var BASE = `
I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger, and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals, and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them.

Client Profile:

Age: {age}
Gender: {gender}
Occupation: {occupation} (remote worker)
Height: {height}
Weight: {weight}
Blood type: {blood_type}
Goal: {fitness_goal}
Workout constraints: {workout_constraints}
Specific concerns: {specific_concerns}
Workout preference: {workout_preference}
Open to supplements: {supplements_preference}
Please design a comprehensive plan that includes:

A detailed {workout_days}-day weekly workout regimen with specific exercises, sets, reps, and rest periods
A sustainable nutrition plan that supports the goal and considers the client's blood type
Appropriate supplement recommendations
Techniques and exercises to address {specific_concerns}
Daily movement or mobility strategies for a remote worker to stay active and offset sitting
Simple tracking metrics for monitoring progress
Provide practical implementation guidance that fits into a remote worker’s routine, emphasizing sustainability, proper form, and injury prevention.

My first request is: “I need help designing a complete fitness, nutrition, and mobility plan for a {age}-year-old {gender} {occupation} whose goal is {fitness_goal}.”
`;

    const userId = e.record.get("from");
    const to = e.record.get("to");
    const newMsg = e.record.get("message");
    const conversationId = e.record.get("conversation");

    if (to != null) e.next();

    const conversation = $app.findRecordById(
        "conversations", conversationId
    );

    if (conversation == null) e.next();

    $app.db().update('conversations', { lastMessage: newMsg, lastMessageDate: new Date() }, $dbx.exp("id = {:id}", { id: conversationId })).execute();

    if (conversation.isAI != true) e.next();

    // get all messages do the prompt
    const messages = $app.findRecordsByFilter(
        "messages", `conversation = "${conversation.id}"`
    );

    if (messages.length === 0) e.next();

    const history = messages.map(m => { return { role: m.getString("role"), content: m.getString("message") } });

    const msgs = [
        { role: "system", content: BASE },
        ...history,
        { role: "user", content: newMsg },
    ];

    const res = $http.send({
        url: "https://api.openai.com/v1/chat/completions",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...msgs],
        }),
    });

    if (res.statusCode === 200) {
        const reply = res.json.choices[0]?.message?.content || "";
        $app.db().insert('messages', {
            to: userId,
            conversation: conversationId,
            message: reply,
            created: new Date(),
            updated: new Date(),
            role: "assistant"
        }).execute();

        $app.db().update('conversations', { lastMessage: reply, lastMessageDate: new Date() }, $dbx.exp("id = {:id}", { id: conversationId })).execute();

        const message = new SubscriptionMessage({
            name: conversationId,
            data: JSON.stringify({ message: reply, from: null, to: userId, created: new Date(), role: "assistant", conversationId: conversationId }),
        });

        const clients = $app.subscriptionsBroker().clients()

        for (let clientId in clients) {
            if (clients[clientId].hasSubscription(conversationId)) {
                clients[clientId].send(message)
            }
        }

    }

    e.next();

}, "messages")