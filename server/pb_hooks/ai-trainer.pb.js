/// <reference path="../pb_data/types.d.ts" />


onRecordCreate((e) => {

    const CREATE_WORKOUT_PROGRAM_SCHEMA = {
        type: "function",
        name: "create_workout_program",
        description: "Create a workout program from the user's profile.",
        parameters: {
            type: "object",
            properties: {
                profile: {
                    type: "object",
                    properties: {
                        experience_level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                        goals: { type: "array", items: { type: "string", enum: ["fat_loss", "muscle_gain", "strength"] } },
                        days_per_week: { type: "integer" },
                        gender: { type: "string" },
                        injuries: { type: "string" },
                        age: { type: "integer" },
                        occupation: { type: "string" },
                        weight: { type: "string" },
                        bloodType: { type: "string" },
                        time_per_session_min: { type: "integer" },
                        available_equipment: { type: "array", items: { type: "string" } }
                    },
                    required: ["days_per_week"]
                }
            }
        }
    };

    const ANALYZE_PROGRESS_SCHEMA = {
        type: "function",
        name: "analyze_progress",
        description: "Analyze last session or ~1 month progress from simple text logs.",
        strict: false,
        parameters: {
            type: "object",
            properties: {
                mode: { type: "string", enum: ["last_session", "progress_1m"] },
                window_days: { type: "integer", minimum: 7, maximum: 90, default: 30 },
                logs: { type: "string", description: "Raw lines: 'YYYY-MM-DD | Exercise | reps@weight, ... | [BW=kg]'" },
                exercises: { type: "array", items: { type: "string" }, description: "Optional filter (e.g., ['Back Squat','Bench Press'])." }
            },
            required: ["mode"],
            additionalProperties: false
        }
    };

    const CREATE_MEAL_PLAN_SCHEMA = {
        type: "function",
        name: "create_meal_plan",
        description: "Create a structured meal plan.",
        strict: false,
        parameters: {
            type: "object",
            properties: {
                targets: {
                    type: "object",
                    properties: {
                        calories: { type: "integer", minimum: 1000, maximum: 10000 },
                        protein_g: { type: "integer", minimum: 0, maximum: 800 },
                        carbs_g: { type: "integer", minimum: 0, maximum: 800 },
                        fat_g: { type: "integer", minimum: 0, maximum: 400 },
                        days: { type: "integer", minimum: 1, maximum: 30 },
                        meals_per_day: { type: "integer", minimum: 1, maximum: 6 }
                    },
                    required: ["calories", "meals_per_day"]
                },
                prefs: {
                    type: "object",
                    properties: {
                        diet: { type: "string", enum: ["none", "balanced", "high_protein", "keto", "vegetarian", "vegan", "pescatarian"] },
                        allergies: { type: "array", items: { type: "string" } },
                        dislikes: { type: "array", items: { type: "string" } },
                        cuisine: { type: "array", items: { type: "string" } },
                        max_prep_time_min: { type: "integer", minimum: 5, maximum: 180 },
                        budget_level: { type: "string", enum: ["low", "medium", "high"] }
                    }
                },
                notes: { type: "string" }
            },
            //required: ["targets"],
            additionalProperties: false
        }
    };

    const callbackConversationAPI = (previous_response_id, tool_call_id, result) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                previous_response_id: previous_response_id,
                tool_choice: "none",
                input: [
                    { role: "user", content: "" },
                    {
                        type: "function_call_output",
                        call_id: tool_call_id,
                        output: JSON.stringify(result)
                    }
                ]
            })
        });
    }

    const createWorkoutProgram = (message) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                instructions:
                    "Create a detailed workout plan based on this message: " + message +
                    "Return ONLY valid JSON matching the schema. ",
                text: {
                    format: {
                        type: "json_schema",
                        name: "WorkoutProgram",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                days: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            exercises: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string" },
                                                        restDuration: { type: "integer" },
                                                        sets: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    reps: { type: "integer" },
                                                                    rir: { type: "integer" },
                                                                    rpe: { type: "number" },
                                                                    max: { type: "boolean" },
                                                                    weight: { type: "number" }
                                                                },
                                                                required: ["reps", "rir", "rpe", "max", "weight"],
                                                                additionalProperties: false
                                                            }
                                                        }
                                                    },
                                                    required: ["name", "restDuration", "sets"],
                                                    additionalProperties: false
                                                }
                                            }
                                        },
                                        required: ["exercises"],
                                        additionalProperties: false
                                    }
                                }
                            },
                            required: ["days"],
                            additionalProperties: false
                        }
                    }
                },
                input: [{ role: "user", content: "Generate the workout per schema for: " + message }]
            })
        });
    }

    const createMealPlan = (message) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                instructions:
                    "Create a meal plan based on this message: " + message +
                    ". Return the plan as plain text, human-readable. No JSON, no schema.",
                text: {
                    format: { type: "text" }
                },
                input: [{ role: "user", content: "Generate the meal plan for: " + message }]
            })
        });
    }

    const analyzeProgress = (message) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                instructions:
                    "Analyze progress and workout based on this data: " + message +
                    ". Return the analyzed data as plain text, human-readable. No JSON, no schema.",
                text: {
                    format: { type: "text" }
                },
                input: [{ role: "user", content: "Analyze progress and workouts based on this data:: " + message }]
            })
        });
    }

    const conversationAPI = (msgs) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                instructions: "You are an AI personal trainer. Ask short questions to fill required fields for create_workout_program. When ready, call the tool. If user asks about meal plan, ask to fill some fields and call create_meal_plan. If user asks for workout progress analyze call analyze_progress.",
                tools: [CREATE_WORKOUT_PROGRAM_SCHEMA, ANALYZE_PROGRESS_SCHEMA, CREATE_MEAL_PLAN_SCHEMA],
                tool_choice: "auto",
                input: [...msgs]
            })
        });
    }

    let BASE = ``;

    const prompt = new DynamicModel({
        "prompt": "",
    });

    try {
        $app.db()
            .newQuery(`SELECT prompt FROM prompts`)
            .one(prompt);
    } catch (error) {
        e.next();
    }

    BASE = prompt.prompt;

    const userId = e.record.get("from");
    const to = e.record.get("to");
    const newMsg = e.record.get("message");
    const conversationId = e.record.get("conversation");

    if (to != null && to != "") {
        e.next()
        return;
    }
    if ((to == null && userId == null) || (to == "" && userId == "")) {
        e.next();
        return;

    }
    if (userId == "" || userId == null) {
        e.next();
        return;
    }

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
        ...history,
        { role: "user", content: newMsg },
    ];

    const res = conversationAPI(msgs);

    if (res.statusCode == 200) {

        let responseMessage;
        let responsePlan;
        let tokens = res.json.usage?.total_tokens;

        const data = res.json;

        let calls = (data.output || []).filter(o => o.type === "function_call").map(o => ({
            name: o.name,
            args: typeof o.arguments === "string" ? JSON.parse(o.arguments) : (o.arguments || {}),
            tool_call_id: o.call_id || o.id
        }));

        let textChunks = res.json.output
            ?.flatMap(o => o.content || [])
            .filter(c => c.type === "output_text")
            .map(c => c.text);

        responseMessage = textChunks[0];

        if (!calls.length) {
            calls = (data.output || [])
                .flatMap(o => o.content || [])
                .filter(c => c.type === "tool_call")
                .map(c => ({
                    name: c.tool_call?.name,
                    args: JSON.parse(c.tool_call?.arguments || "{}"),
                    tool_call_id: c.tool_call?.id
                }));
        }

        const call = calls[0];

        if (call && call.name === "create_workout_program") {

            const wo = createWorkoutProgram(textChunks);

            let woChunks = wo.json.output
                ?.flatMap(o => o.content || [])
                .filter(c => c.type === "output_text")
                .map(c => c.text);

            responsePlan = woChunks[0];

            const callback = callbackConversationAPI(data.id, call.tool_call_id, woChunks);

            let callbackChunks = callback.json.output
                ?.flatMap(o => o.content || [])
                .filter(c => c.type === "output_text")
                .map(c => c.text);

            responseMessage = callbackChunks[0];

        }

        if (call && call.name === "create_meal_plan") {

            const mp = createMealPlan(textChunks);

            let mpChunks = mp.json.output
                ?.flatMap(o => o.content || [])
                .filter(c => c.type === "output_text")
                .map(c => c.text);

            responseMessage = mpChunks[0];

        }

        if (call && call.name === "analyze_progress") {

            // should also get last 30 days worth of workouts
            const rows = arrayOf(new DynamicModel({
                created: "",
                exerciseName: "",
                currentValue: -0,
                currentWeight: -0,
            }));

            const weightType = new DynamicModel({
                defaultWeightType: -0,
            });

            try {
                $app.db()
                    .newQuery(`SELECT s.created, e.name as exerciseName, s.currentValue, s.currentWeight
                               FROM sets s
                               INNER JOIN exercises e ON s.exercise = e.id
                               WHERE s.created >= DATE('now', '-35 days')`)
                    .bind({
                        "user": e.record.id
                    })
                    .all(rows);

                $app.db()
                    .newQuery(`SELECT defaultWeightType
                               FROM users`)
                    .bind({
                        "user": e.record.id
                    })
                    .one(weightType);

            } catch (error) {
                $app.logger().error(error)
                e.next();
            }

            //const date = row.created.substring(0, 10);

            // Group rows by date and exercise
            let logsByDate = {};
            rows.forEach(row => {
                const date = row.created.substring(0, 10);
                if (!logsByDate[date]) logsByDate[date] = {};
                const name = row.exerciseName;
                if (!logsByDate[date][name]) logsByDate[date][name] = [];
                logsByDate[date][name].push(row);
            });

            let formattedLogs = Object.entries(logsByDate).map(([date, exercises]) => {
                // For each exercise, join all sets as "reps@weight"
                const exerciseStrings = Object.entries(exercises).map(([name, sets]) => {
                    const setStrings = sets.map(set => `${set.currentValue}@${set.currentWeight}`);
                    return `${name} | ${setStrings.join(', ')}`;
                }).join(' | ');
                return `${date} | ${exerciseStrings}`;
            }).join('\n');

            const kgsOrLbs = weightType.defaultWeightType == 2 ? 'kg' : 'lb';

            textChunks = ["Current date: " + new Date().toISOString() + ". " + "Use unit: " + kgsOrLbs + "." + formattedLogs];

            const pr = analyzeProgress(textChunks);

            let prChunks = pr.json.output
                ?.flatMap(o => o.content || [])
                .filter(c => c.type === "output_text")
                .map(c => c.text);

            responseMessage = prChunks[0];

        }

        $app.db().insert('messages', {
            to: userId,
            conversation: conversationId,
            message: responseMessage,
            plan: responsePlan ? responsePlan : undefined,
            created: new Date(),
            updated: new Date(),
            tokens: tokens,
            role: "assistant"
        }).execute();

        $app.db().update('conversations', { lastMessage: responseMessage, lastMessageDate: new Date() }, $dbx.exp("id = {:id}", { id: conversationId })).execute();

        const message = new SubscriptionMessage({
            name: conversationId,
            data: JSON.stringify({ message: responseMessage, plan: responsePlan, from: null, to: userId, created: new Date(), role: "assistant", conversationId: conversationId }),
        });

        const clients = $app.subscriptionsBroker().clients()

        for (let clientId in clients) {
            if (clients[clientId].hasSubscription(conversationId)) {
                clients[clientId].send(message)
            }
        }

    } else {
        $app.logger().error(res.raw)
    }

    e.next();

}, "messages");


