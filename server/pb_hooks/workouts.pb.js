/// <reference path="../pb_data/types.d.ts" />

// Only 1 active workout per user may exists.
onRecordUpdate((e) => {
    const userId = e.record.get("user");

    const existingWorkout = $app.findRecordsByFilter(
        "workouts",
        `user = "${userId}" && state = 1 && id != "${e.record.id}"`
    )[0];

    if (existingWorkout && existingWorkout.id !== e.record.id) {
        try {
            $app.delete(e.record);
        } catch {
            // err if record does not exist
        }
        throw new ApiError(409, "Workout already in progress.", {
            "workout": new ValidationError("workout.already_in_progress", "Already in progress."),
        })
    }

    e.next();
}, "workouts")
