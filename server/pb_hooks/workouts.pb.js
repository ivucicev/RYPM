/// <reference path="../pb_data/types.d.ts" />

// Only 1 active workout per user may exists.
onRecordCreate((e) => {
    const userId = e.record.get("user");

    const existingWorkout = $app.findRecordsByFilter(
        "workouts",
        `user = "${userId}" && state = 1 && id != "${e.record.id}"`
    )[0];

    if (existingWorkout && existingWorkout.id !== e.record.id) {
        throw new ApiError(409, "Workout already in progress.", {
            "workout": new ValidationError("Workout already in progress", "Workout already in progress."),
        })
    }

    e.next();
}, "workouts")
