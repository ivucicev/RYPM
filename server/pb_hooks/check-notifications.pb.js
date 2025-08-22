/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/check-notifications", (e) => {

    const notifications = arrayOf(new DynamicModel({
        id: "",
        sendAt: "",
        token: "",
        body: {},
        state: "",
        created: ""
    }));

    try {
        $app.db().newQuery(`SELECT id, sendAt, token, body, state, created FROM notifications WHERE sendAt <= DATETIME('now') AND state="prepared" ORDER BY sendAt DESC`).all(notifications);
    } catch (error) {
        $app.logger().error(error)
        e.next();
        return e.json(400, { "error": error });
    }

    if (!notifications || notifications.length == 0) return e.json(200, { "message": "No active notifications" });

    let sentTokens = [];

    notifications.forEach(notification => {

        if (sentTokens.includes(notification.token))
            $app.db().update('notifications', { state: 'cancelled' }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
        else
            $app.db().update('notifications', { state: 'sent' }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();

        const sent = $http.send({
            url: process.env.PUSH_SEND_URL,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${notification.token}`
            },
            body: JSON.stringify(notification.body)
        });

        if (sent.statusCode == 200) {
            sentTokens.push(notification.token);
        } else {
            $app.db().update('notifications', { state: 'error', errorMessage: sent.raw }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
        }
    })

    return e.json(200, { "message": "ok" });

})
