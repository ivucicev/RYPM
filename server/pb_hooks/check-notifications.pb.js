/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/check-notifications", (e) => {

    const notifications = arrayOf(new DynamicModel({
        id: "",
        sendAt: "",
        body: {},
        state: "",
        token: "",
        created: ""
    }));

    try {
        $app.db().newQuery(`
            SELECT n.id, n.sendAt, n.body, n.state, n.created, u.notificationsToken as token
            FROM notifications n
            INNER JOIN users u ON n.[to] = u.id
            WHERE n.sendAt <= DATETIME('now')
              AND n.state = "prepared"
              AND u.notificationsToken IS NOT NULL
            ORDER BY n.sendAt DESC
        `).all(notifications);
    } catch (error) {
        $app.logger().error(error)
        e.next();
        return e.json(400, { "error": error });
    }

    if (!notifications || notifications.length == 0) return e.json(200, { "message": "No active notifications" });

    let sentTokens = [];


    notifications.forEach(notification => {

        const body = JSON.parse(notification.body);
        body.token = notification.token;

        if (sentTokens.includes(notification.token)) {
            $app.db().update('notifications', { state: 'cancelled' }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
            return;
        }

        try {
            const sent = $http.send({
                url: process.env.PUSH_SEND_URL,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${notification.token}`
                },
                body: JSON.stringify(body)
            });

            if (sent.statusCode == 200) {
                const sentAt = new Date();
                const sendAt = new Date(notification.sendAt);
                const delay = Math.floor((sentAt - sendAt) / 1000);
                $app.db().update('notifications', { state: 'sent', delay: delay, sentAt: sentAt }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
                sentTokens.push(notification.token);
            } else {
                $app.db().update('notifications', { state: 'error', errorMessage: sent.raw }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
            }
        } catch (error) {
            $app.db().update('notifications', { state: 'error', errorMessage: error }, $dbx.exp("id = {:id}", { id: notification?.id })).execute();
        }
    })

    return e.json(200, { "message": "ok" });

})
