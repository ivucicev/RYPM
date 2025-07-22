/// <reference path="../pb_data/types.d.ts" />


//*** IMPORTS EXERCISE TEMPLATES FROM ./pb_data/exercise-templates.json ***
onBootstrap((e) => {
    e.next()
    try {
        console.log("*** STARTED: IMPORT TO exercise_templates ***");

        const collection = $app.findCollectionByNameOrId("exercise_templates");
        if (!collection) {
            console.log("exercise_templates collection not found, skipping import...");
            return;
        }

        // Check if data already exists
        try {
            const existingRecords = $app.findFirstRecordByFilter(
                collection.id,
                'id != null',
            );

            if (existingRecords != null) {
                console.log("exercise_templates already have data, skipping...");
                return;
            }
        } catch {
            console.log("Can't find any record in exercise_templates, beginning import...");
        }

        console.log("Reading exercises.json file...");

        const fileBytes = $os.readFile("./pb_import/exercise-templates.json");
        const bytesToString = (bytes) => {
            if (typeof bytes === 'string') return bytes;

            const chunkSize = 8192;
            let result = '';

            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.slice(i, i + chunkSize);
                result += String.fromCharCode.apply(null, chunk);
            }

            return result;
        };
        const jsonContent = bytesToString(fileBytes);

        const exercises = JSON.parse(jsonContent);

        console.log(`Starting import of ${exercises.length} exercise templates...`);

        let successCount = 0;

        exercises.forEach((exercise, index) => {
            try {
                const record = new Record(collection);

                // Normalize values to match enum format
                record.set("name", exercise.name || "");
                record.set("force", exercise.force?.replace(/\s+/g, '').replace(/-/g, '').toLowerCase() || "");
                record.set("level", exercise.level?.replace(/\s+/g, '').replace(/-/g, '').toLowerCase() || "");
                record.set("mechanic", exercise.mechanic?.replace(/\s+/g, '').replace(/-/g, '').toLowerCase() || "");
                record.set("equipment", exercise.equipment?.replace(/\s+/g, '').replace(/-/g, '').toLowerCase() || "");
                record.set("primaryMuscles", (exercise.primaryMuscles || []).map(m => m.toLowerCase().replace(/\s+/g, '')));
                record.set("secondaryMuscles", (exercise.secondaryMuscles || []).map(m => m.toLowerCase().replace(/\s+/g, '')));
                record.set("instructions", (exercise.instructions || []).join('\n'));
                record.set("category", exercise.category?.replace(/\s+/g, '').replace(/-/g, '').toLowerCase() || "");

                $app.save(record);
                successCount++;

                if ((index + 1) % 50 === 0) {
                    console.log(`Progress: ${index + 1}/${exercises.length} processed...`);
                }

            } catch (saveErr) {
                console.log(`Failed to save exercise "${exercise.name}": ${saveErr.message}`);
            }
        });

        console.log(`Import completed! Successfully imported ${successCount} exercises`);

    } catch (err) {
        console.log(`Exercise import failed: ${err.message}`);
    }
    finally {
        console.log("*** ENDED: IMPORT TO exercise_templates***");
    }
});
