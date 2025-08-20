/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateSuccess((e) => {

       /* const userId = e.record.get("user");
    const completed = e.record.getBool("completed");
    const completedAt = e.record.getDateTime("completedAt");

    const user = new DynamicModel({
        notificationsEnabled: "",
        notificationsToken: ""
    });

    $app.db()
        .newQuery(`SELECT notificationsEnabled, notificationsToken FROM users WHERE user={:user}`)
        .bind({ "user": userId }).one(user);

    if (completed) {
        // statr timer
        // insert timer
        const restDurationValue = this.lastCompletedSetExercise.controls.restDuration.value;
        const sendAt = new Date(completedAt + (restDurationValue * 1000) - 2000);

                        sendAt: sendAt.toISOString(),
                state: 'prepared',
                body: {},

        const timer = {
            sendAt: sendAt,
            token: user.notificationsToken,
            state: 'prepared'
        };
        $app.db().insert('timers', timer).execute();
    } else {

    }

const existingWorkout = $app.findRecordsByFilter(
        "workouts",
        `user = "${userId}" && state = 1 && id != "${e.record.id}"`
    )[0];*/

    e.next();
}, "sets")