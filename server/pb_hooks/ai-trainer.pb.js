/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {

    const EXERCISES = "3/4 Sit-Up,90/90 Hamstring,Ab Crunch Machine,Ab Roller,Adductor,Adductor/Groin,Advanced Kettlebell Windmill,Air Bike,All Fours Quad Stretch,Alternate Hammer Curl,Alternate Heel Touchers,Alternate Incline Dumbbell Curl,Alternate Leg Diagonal Bound,Alternating Cable Shoulder Press,Alternating Deltoid Raise,Alternating Floor Press,Alternating Hang Clean,Alternating Kettlebell Press,Alternating Kettlebell Row,Alternating Renegade Row,Ankle Circles,Ankle On The Knee,Anterior Tibialis-SMR,Anti-Gravity Press,Arm Circles,Arnold Dumbbell Press,Around The Worlds,Atlas Stone Trainer,Atlas Stones,Axle Deadlift,Back Flyes - With Bands,Backward Drag,Backward Medicine Ball Throw,Balance Board,Ball Leg Curl,Band Assisted Pull-Up,Band Good Morning,Band Good Morning (Pull Through),Band Hip Adductions,Band Pull Apart,Band Skull Crusher,Barbell Ab Rollout,Barbell Ab Rollout - On Knees,Barbell Bench Press - Medium Grip,Barbell Curl,Barbell Curls Lying Against An Incline,Barbell Deadlift,Barbell Full Squat,Barbell Glute Bridge,Barbell Guillotine Bench Press,Barbell Hack Squat,Barbell Hip Thrust,Barbell Incline Bench Press - Medium Grip,Barbell Incline Shoulder Raise,Barbell Lunge,Barbell Rear Delt Row,Barbell Rollout from Bench,Barbell Seated Calf Raise,Barbell Shoulder Press,Barbell Shrug,Barbell Shrug Behind The Back,Barbell Side Bend,Barbell Side Split Squat,Barbell Squat,Barbell Squat To A Bench,Barbell Step Ups,Barbell Walking Lunge,Battling Ropes,Bear Crawl Sled Drags,Behind Head Chest Stretch,Bench Dips,Bench Jump,Bench Press - Powerlifting,Bench Press - With Bands,Bench Press with Chains,Bench Sprint,Bent-Arm Barbell Pullover,Bent-Arm Dumbbell Pullover,Bent-Knee Hip Raise,Bent Over Barbell Row,Bent Over Dumbbell Rear Delt Raise With Head On Bench,Bent Over Low-Pulley Side Lateral,Bent Over One-Arm Long Bar Row,Bent Over Two-Arm Long Bar Row,Bent Over Two-Dumbbell Row,Bent Over Two-Dumbbell Row With Palms In,Bent Press,Bicycling,Bicycling, Stationary,Board Press,Body-Up,Body Tricep Press,Bodyweight Flyes,Bodyweight Mid Row,Bodyweight Squat,Bodyweight Walking Lunge,Bosu Ball Cable Crunch With Side Bends,Bottoms-Up Clean From The Hang Position,Bottoms Up,Box Jump (Multiple Response),Box Skip,Box Squat,Box Squat with Bands,Box Squat with Chains,Brachialis-SMR,Bradford/Rocky Presses,Butt-Ups,Butt Lift (Bridge),Butterfly,Cable Chest Press,Cable Crossover,Cable Crunch,Cable Deadlifts,Cable Hammer Curls - Rope Attachment,Cable Hip Adduction,Cable Incline Pushdown,Cable Incline Triceps Extension,Cable Internal Rotation,Cable Iron Cross,Cable Judo Flip,Cable Lying Triceps Extension,Cable One Arm Tricep Extension,Cable Preacher Curl,Cable Rear Delt Fly,Cable Reverse Crunch,Cable Rope Overhead Triceps Extension,Cable Rope Rear-Delt Rows,Cable Russian Twists,Cable Seated Crunch,Cable Seated Lateral Raise,Cable Shoulder Press,Cable Shrugs,Cable Wrist Curl,Calf-Machine Shoulder Shrug,Calf Press,Calf Press On The Leg Press Machine,Calf Raise On A Dumbbell,Calf Raises - With Bands,Calf Stretch Elbows Against Wall,Calf Stretch Hands Against Wall,Calves-SMR,Car Deadlift,Car Drivers,Carioca Quick Step,Cat Stretch,Catch and Overhead Throw,Chain Handle Extension,Chain Press,Chair Leg Extended Stretch,Chair Lower Back Stretch,Chair Squat,Chair Upper Body Stretch,Chest And Front Of Shoulder Stretch,Chest Push from 3 point stance,Chest Push (multiple response),Chest Push (single response),Chest Push with Run Release,Chest Stretch on Stability Ball,Child's Pose,Chin-Up,Chin To Chest Stretch,Circus Bell,Clean,Clean Deadlift,Clean Pull,Clean Shrug,Clean and Jerk,Clean and Press,Clean from Blocks,Clock Push-Up,Close-Grip Barbell Bench Press,Close-Grip Dumbbell Press,Close-Grip EZ-Bar Curl with Band,Close-Grip EZ-Bar Press,Close-Grip EZ Bar Curl,Close-Grip Front Lat Pulldown,Close-Grip Push-Up off of a Dumbbell,Close-Grip Standing Barbell Curl,Cocoons,Conan's Wheel,Concentration Curls,Cross-Body Crunch,Cross Body Hammer Curl,Cross Over - With Bands,Crossover Reverse Lunge,Crucifix,Crunch - Hands Overhead,Crunch - Legs On Exercise Ball,Crunches,Cuban Press,Dancer's Stretch,Dead Bug,Deadlift with Bands,Deadlift with Chains,Decline Barbell Bench Press,Decline Close-Grip Bench To Skull Crusher,Decline Crunch,Decline Dumbbell Bench Press,Decline Dumbbell Flyes,Decline Dumbbell Triceps Extension,Decline EZ Bar Triceps Extension,Decline Oblique Crunch,Decline Push-Up,Decline Reverse Crunch,Decline Smith Press,Deficit Deadlift,Depth Jump Leap,Dip Machine,Dips - Chest Version,Dips - Triceps Version,Donkey Calf Raises,Double Kettlebell Alternating Hang Clean,Double Kettlebell Jerk,Double Kettlebell Push Press,Double Kettlebell Snatch,Double Kettlebell Windmill,Double Leg Butt Kick,Downward Facing Balance,Drag Curl,Drop Push,Dumbbell Alternate Bicep Curl,Dumbbell Bench Press,Dumbbell Bench Press with Neutral Grip,Dumbbell Bicep Curl,Dumbbell Clean,Dumbbell Floor Press,Dumbbell Flyes,Dumbbell Incline Row,Dumbbell Incline Shoulder Raise,Dumbbell Lunges,Dumbbell Lying One-Arm Rear Lateral Raise,Dumbbell Lying Pronation,Dumbbell Lying Rear Lateral Raise,Dumbbell Lying Supination,Dumbbell One-Arm Shoulder Press,Dumbbell One-Arm Triceps Extension,Dumbbell One-Arm Upright Row,Dumbbell Prone Incline Curl,Dumbbell Raise,Dumbbell Rear Lunge,Dumbbell Scaption,Dumbbell Seated Box Jump,Dumbbell Seated One-Leg Calf Raise,Dumbbell Shoulder Press,Dumbbell Shrug,Dumbbell Side Bend,Dumbbell Squat,Dumbbell Squat To A Bench,Dumbbell Step Ups,Dumbbell Tricep Extension -Pronated Grip,Dynamic Back Stretch,Dynamic Chest Stretch,EZ-Bar Curl,EZ-Bar Skullcrusher,Elbow Circles,Elbow to Knee,Elbows Back,Elevated Back Lunge,Elevated Cable Rows,Elliptical Trainer,Exercise Ball Crunch,Exercise Ball Pull-In,Extended Range One-Arm Kettlebell Floor Press,External Rotation,External Rotation with Band,External Rotation with Cable,Face Pull,Farmer's Walk,Fast Skipping,Finger Curls,Flat Bench Cable Flyes,Flat Bench Leg Pull-In,Flat Bench Lying Leg Raise,Flexor Incline Dumbbell Curls,Floor Glute-Ham Raise,Floor Press,Floor Press with Chains,Flutter Kicks,Foot-SMR,Forward Drag with Press,Frankenstein Squat,Freehand Jump Squat,Frog Hops,Frog Sit-Ups,Front Barbell Squat,Front Barbell Squat To A Bench,Front Box Jump,Front Cable Raise,Front Cone Hops (or hurdle hops),Front Dumbbell Raise,Front Incline Dumbbell Raise,Front Leg Raises,Front Plate Raise,Front Raise And Pullover,Front Squat (Clean Grip),Front Squats With Two Kettlebells,Front Two-Dumbbell Raise,Full Range-Of-Motion Lat Pulldown,Gironda Sternum Chins,Glute Ham Raise,Glute Kickback,Goblet Squat,Good Morning,Good Morning off Pins,Gorilla Chin/Crunch,Groin and Back Stretch,Groiners,Hack Squat,Hammer Curls,Hammer Grip Incline DB Bench Press,Hamstring-SMR,Hamstring Stretch,Handstand Push-Ups,Hang Clean,Hang Clean - Below the Knees,Hang Snatch,Hang Snatch - Below Knees,Hanging Bar Good Morning,Hanging Leg Raise,Hanging Pike,Heaving Snatch Balance,Heavy Bag Thrust,High Cable Curls,Hip Circles (prone),Hip Extension with Bands,Hip Flexion with Band,Hip Lift with Band,Hug A Ball,Hug Knees To Chest,Hurdle Hops,Hyperextensions (Back Extensions),Hyperextensions With No Hyperextension Bench,IT Band and Glute Stretch,Iliotibial Tract-SMR,Inchworm,Incline Barbell Triceps Extension,Incline Bench Pull,Incline Cable Chest Press,Incline Cable Flye,Incline Dumbbell Bench With Palms Facing In,Incline Dumbbell Curl,Incline Dumbbell Flyes,Incline Dumbbell Flyes - With A Twist,Incline Dumbbell Press,Incline Hammer Curls,Incline Inner Biceps Curl,Incline Push-Up,Incline Push-Up Close-Grip,Incline Push-Up Depth Jump,Incline Push-Up Medium,Incline Push-Up Reverse Grip,Incline Push-Up Wide,Intermediate Groin Stretch,Intermediate Hip Flexor and Quad Stretch,Internal Rotation with Band,Inverted Row,Inverted Row with Straps,Iron Cross,Iron Crosses (stretch),Isometric Chest Squeezes,Isometric Neck Exercise - Front And Back,Isometric Neck Exercise - Sides,Isometric Wipers,JM Press,Jackknife Sit-Up,Janda Sit-Up,Jefferson Squats,Jerk Balance,Jerk Dip Squat,Jogging, Treadmill,Keg Load,Kettlebell Arnold Press,Kettlebell Dead Clean,Kettlebell Figure 8,Kettlebell Hang Clean,Kettlebell One-Legged Deadlift,Kettlebell Pass Between The Legs,Kettlebell Pirate Ships,Kettlebell Pistol Squat,Kettlebell Seated Press,Kettlebell Seesaw Press,Kettlebell Sumo High Pull,Kettlebell Thruster,Kettlebell Turkish Get-Up (Lunge style),Kettlebell Turkish Get-Up (Squat style),Kettlebell Windmill,Kipping Muscle Up,Knee Across The Body,Knee Circles,Knee/Hip Raise On Parallel Bars,Knee Tuck Jump,Kneeling Arm Drill,Kneeling Cable Crunch With Alternating Oblique Twists,Kneeling Cable Triceps Extension,Kneeling Forearm Stretch,Kneeling High Pulley Row,Kneeling Hip Flexor,Kneeling Jump Squat,Kneeling Single-Arm High Pulley Row,Kneeling Squat,Landmine 180's,Landmine Linear Jammer,Lateral Bound,Lateral Box Jump,Lateral Cone Hops,Lateral Raise - With Bands,Latissimus Dorsi-SMR,Leg-Over Floor Press,Leg-Up Hamstring Stretch,Leg Extensions,Leg Lift,Leg Press,Leg Pull-In,Leverage Chest Press,Leverage Deadlift,Leverage Decline Chest Press,Leverage High Row,Leverage Incline Chest Press,Leverage Iso Row,Leverage Shoulder Press,Leverage Shrug,Linear 3-Part Start Technique,Linear Acceleration Wall Drill,Linear Depth Jump,Log Lift,London Bridges,Looking At Ceiling,Low Cable Crossover,Low Cable Triceps Extension,Low Pulley Row To Neck,Lower Back-SMR,Lower Back Curl,Lunge Pass Through,Lunge Sprint,Lying Bent Leg Groin,Lying Cable Curl,Lying Cambered Barbell Row,Lying Close-Grip Bar Curl On High Pulley,Lying Close-Grip Barbell Triceps Extension Behind The Head,Lying Close-Grip Barbell Triceps Press To Chin,Lying Crossover,Lying Dumbbell Tricep Extension,Lying Face Down Plate Neck Resistance,Lying Face Up Plate Neck Resistance,Lying Glute,Lying Hamstring,Lying High Bench Barbell Curl,Lying Leg Curls,Lying Machine Squat,Lying One-Arm Lateral Raise,Lying Prone Quadriceps,Lying Rear Delt Raise,Lying Supine Dumbbell Curl,Lying T-Bar Row,Lying Triceps Press,Machine Bench Press,Machine Bicep Curl,Machine Preacher Curls,Machine Shoulder (Military) Press,Machine Triceps Extension,Medicine Ball Chest Pass,Medicine Ball Full Twist,Medicine Ball Scoop Throw,Middle Back Shrug,Middle Back Stretch,Mixed Grip Chin,Monster Walk,Mountain Climbers,Moving Claw Series,Muscle Snatch,Muscle Up,Narrow Stance Hack Squats,Narrow Stance Leg Press,Narrow Stance Squats,Natural Glute Ham Raise,Neck-SMR,Neck Press,Oblique Crunches,Oblique Crunches - On The Floor,Olympic Squat,On-Your-Back Quad Stretch,On Your Side Quad Stretch,One-Arm Dumbbell Row,One-Arm Flat Bench Dumbbell Flye,One-Arm High-Pulley Cable Side Bends,One-Arm Incline Lateral Raise,One-Arm Kettlebell Clean,One-Arm Kettlebell Clean and Jerk,One-Arm Kettlebell Floor Press,One-Arm Kettlebell Jerk,One-Arm Kettlebell Military Press To The Side,One-Arm Kettlebell Para Press,One-Arm Kettlebell Push Press,One-Arm Kettlebell Row,One-Arm Kettlebell Snatch,One-Arm Kettlebell Split Jerk,One-Arm Kettlebell Split Snatch,One-Arm Kettlebell Swings,One-Arm Long Bar Row,One-Arm Medicine Ball Slam,One-Arm Open Palm Kettlebell Clean,One-Arm Overhead Kettlebell Squats,One-Arm Side Deadlift,One-Arm Side Laterals,One-Legged Cable Kickback,One Arm Against Wall,One Arm Chin-Up,One Arm Dumbbell Bench Press,One Arm Dumbbell Preacher Curl,One Arm Floor Press,One Arm Lat Pulldown,One Arm Pronated Dumbbell Triceps Extension,One Arm Supinated Dumbbell Triceps Extension,One Half Locust,One Handed Hang,One Knee To Chest,One Leg Barbell Squat,Open Palm Kettlebell Clean,Otis-Up,Overhead Cable Curl,Overhead Lat,Overhead Slam,Overhead Squat,Overhead Stretch,Overhead Triceps,Pallof Press,Pallof Press With Rotation,Palms-Down Dumbbell Wrist Curl Over A Bench,Palms-Down Wrist Curl Over A Bench,Palms-Up Barbell Wrist Curl Over A Bench,Palms-Up Dumbbell Wrist Curl Over A Bench,Parallel Bar Dip,Pelvic Tilt Into Bridge,Peroneals-SMR,Peroneals Stretch,Physioball Hip Bridge,Pin Presses,Piriformis-SMR,Plank,Plate Pinch,Plate Twist,Platform Hamstring Slides,Plie Dumbbell Squat,Plyo Kettlebell Pushups,Plyo Push-up,Posterior Tibialis Stretch,Power Clean,Power Clean from Blocks,Power Jerk,Power Partials,Power Snatch,Power Snatch from Blocks,Power Stairs,Preacher Curl,Preacher Hammer Dumbbell Curl,Press Sit-Up,Prone Manual Hamstring,Prowler Sprint,Pull Through,Pullups,Push-Up Wide,Push-Ups - Close Triceps Position,Push-Ups With Feet Elevated,Push-Ups With Feet On An Exercise Ball,Push Press,Push Press - Behind the Neck,Push Up to Side Plank,Pushups,Pushups (Close and Wide Hand Positions),Pyramid,Quad Stretch,Quadriceps-SMR,Quick Leap,Rack Delivery,Rack Pull with Bands,Rack Pulls,Rear Leg Raises,Recumbent Bike,Return Push from Stance,Reverse Band Bench Press,Reverse Band Box Squat,Reverse Band Deadlift,Reverse Band Power Squat,Reverse Band Sumo Deadlift,Reverse Barbell Curl,Reverse Barbell Preacher Curls,Reverse Cable Curl,Reverse Crunch,Reverse Flyes,Reverse Flyes With External Rotation,Reverse Grip Bent-Over Rows,Reverse Grip Triceps Pushdown,Reverse Hyperextension,Reverse Machine Flyes,Reverse Plate Curls,Reverse Triceps Bench Press,Rhomboids-SMR,Rickshaw Carry,Rickshaw Deadlift,Ring Dips,Rocket Jump,Rocking Standing Calf Raise,Rocky Pull-Ups/Pulldowns,Romanian Deadlift,Romanian Deadlift from Deficit,Rope Climb,Rope Crunch,Rope Jumping,Rope Straight-Arm Pulldown,Round The World Shoulder Stretch,Rowing, Stationary,Runner's Stretch,Running, Treadmill,Russian Twist,Sandbag Load,Scapular Pull-Up,Scissor Kick,Scissors Jump,Seated Band Hamstring Curl,Seated Barbell Military Press,Seated Barbell Twist,Seated Bent-Over One-Arm Dumbbell Triceps Extension,Seated Bent-Over Rear Delt Raise,Seated Bent-Over Two-Arm Dumbbell Triceps Extension,Seated Biceps,Seated Cable Rows,Seated Cable Shoulder Press,Seated Calf Raise,Seated Calf Stretch,Seated Close-Grip Concentration Barbell Curl,Seated Dumbbell Curl,Seated Dumbbell Inner Biceps Curl,Seated Dumbbell Palms-Down Wrist Curl,Seated Dumbbell Palms-Up Wrist Curl,Seated Dumbbell Press,Seated Flat Bench Leg Pull-In,Seated Floor Hamstring Stretch,Seated Front Deltoid,Seated Glute,Seated Good Mornings,Seated Hamstring,Seated Hamstring and Calf Stretch,Seated Head Harness Neck Resistance,Seated Leg Curl,Seated Leg Tucks,Seated One-Arm Dumbbell Palms-Down Wrist Curl,Seated One-Arm Dumbbell Palms-Up Wrist Curl,Seated One-arm Cable Pulley Rows,Seated Overhead Stretch,Seated Palm-Up Barbell Wrist Curl,Seated Palms-Down Barbell Wrist Curl,Seated Side Lateral Raise,Seated Triceps Press,Seated Two-Arm Palms-Up Low-Pulley Wrist Curl,See-Saw Press (Alternating Side Press),Shotgun Row,Shoulder Circles,Shoulder Press - With Bands,Shoulder Raise,Shoulder Stretch,Side-Lying Floor Stretch,Side Bridge,Side Hop-Sprint,Side Jackknife,Side Lateral Raise,Side Laterals to Front Raise,Side Leg Raises,Side Lying Groin Stretch,Side Neck Stretch,Side Standing Long Jump,Side To Side Chins,Side Wrist Pull,Side to Side Box Shuffle,Single-Arm Cable Crossover,Single-Arm Linear Jammer,Single-Arm Push-Up,Single-Cone Sprint Drill,Single-Leg High Box Squat,Single-Leg Hop Progression,Single-Leg Lateral Hop,Single-Leg Leg Extension,Single-Leg Stride Jump,Single Dumbbell Raise,Single Leg Butt Kick,Single Leg Glute Bridge,Single Leg Push-off,Sit-Up,Sit Squats,Skating,Sled Drag - Harness,Sled Overhead Backward Walk,Sled Overhead Triceps Extension,Sled Push,Sled Reverse Flye,Sled Row,Sledgehammer Swings,Smith Incline Shoulder Raise,Smith Machine Behind the Back Shrug,Smith Machine Bench Press,Smith Machine Bent Over Row,Smith Machine Calf Raise,Smith Machine Close-Grip Bench Press,Smith Machine Decline Press,Smith Machine Hang Power Clean,Smith Machine Hip Raise,Smith Machine Incline Bench Press,Smith Machine Leg Press,Smith Machine One-Arm Upright Row,Smith Machine Overhead Shoulder Press,Smith Machine Pistol Squat,Smith Machine Reverse Calf Raises,Smith Machine Squat,Smith Machine Stiff-Legged Deadlift,Smith Machine Upright Row,Smith Single-Leg Split Squat,Snatch,Snatch Balance,Snatch Deadlift,Snatch Pull,Snatch Shrug,Snatch from Blocks,Speed Band Overhead Triceps,Speed Box Squat,Speed Squats,Spell Caster,Spider Crawl,Spider Curl,Spinal Stretch,Split Clean,Split Jerk,Split Jump,Split Snatch,Split Squat with Dumbbells,Split Squats,Squat Jerk,Squat with Bands,Squat with Chains,Squat with Plate Movers,Squats - With Bands,Stairmaster,Standing Alternating Dumbbell Press,Standing Barbell Calf Raise,Standing Barbell Press Behind Neck,Standing Bent-Over One-Arm Dumbbell Triceps Extension,Standing Bent-Over Two-Arm Dumbbell Triceps Extension,Standing Biceps Cable Curl,Standing Biceps Stretch,Standing Bradford Press,Standing Cable Chest Press,Standing Cable Lift,Standing Cable Wood Chop,Standing Calf Raises,Standing Concentration Curl,Standing Dumbbell Calf Raise,Standing Dumbbell Press,Standing Dumbbell Reverse Curl,Standing Dumbbell Straight-Arm Front Delt Raise Above Head,Standing Dumbbell Triceps Extension,Standing Dumbbell Upright Row,Standing Elevated Quad Stretch,Standing Front Barbell Raise Over Head,Standing Gastrocnemius Calf Stretch,Standing Hamstring and Calf Stretch,Standing Hip Circles,Standing Hip Flexors,Standing Inner-Biceps Curl,Standing Lateral Stretch,Standing Leg Curl,Standing Long Jump,Standing Low-Pulley Deltoid Raise,Standing Low-Pulley One-Arm Triceps Extension,Standing Military Press,Standing Olympic Plate Hand Squeeze,Standing One-Arm Cable Curl,Standing One-Arm Dumbbell Curl Over Incline Bench,Standing One-Arm Dumbbell Triceps Extension,Standing Overhead Barbell Triceps Extension,Standing Palm-In One-Arm Dumbbell Press,Standing Palms-In Dumbbell Press,Standing Palms-Up Barbell Behind The Back Wrist Curl,Standing Pelvic Tilt,Standing Rope Crunch,Standing Soleus And Achilles Stretch,Standing Toe Touches,Standing Towel Triceps Extension,Standing Two-Arm Overhead Throw,Star Jump,Step-up with Knee Raise,Step Mill,Stiff-Legged Barbell Deadlift,Stiff-Legged Dumbbell Deadlift,Stiff Leg Barbell Good Morning,Stomach Vacuum,Straight-Arm Dumbbell Pullover,Straight-Arm Pulldown,Straight Bar Bench Mid Rows,Straight Raises on Incline Bench,Stride Jump Crossover,Sumo Deadlift,Sumo Deadlift with Bands,Sumo Deadlift with Chains,Superman,Supine Chest Throw,Supine One-Arm Overhead Throw,Supine Two-Arm Overhead Throw,Suspended Fallout,Suspended Push-Up,Suspended Reverse Crunch,Suspended Row,Suspended Split Squat,Svend Press,T-Bar Row with Handle,Tate Press,The Straddle,Thigh Abductor,Thigh Adductor,Tire Flip,Toe Touchers,Torso Rotation,Trail Running/Walking,Trap Bar Deadlift,Tricep Dumbbell Kickback,Tricep Side Stretch,Triceps Overhead Extension with Rope,Triceps Pushdown,Triceps Pushdown - Rope Attachment,Triceps Pushdown - V-Bar Attachment,Triceps Stretch,Tuck Crunch,Two-Arm Dumbbell Preacher Curl,Two-Arm Kettlebell Clean,Two-Arm Kettlebell Jerk,Two-Arm Kettlebell Military Press,Two-Arm Kettlebell Row,Underhand Cable Pulldowns,Upper Back-Leg Grab,Upper Back Stretch,Upright Barbell Row,Upright Cable Row,Upright Row - With Bands,Upward Stretch,V-Bar Pulldown,V-Bar Pullup,Vertical Swing,Walking, Treadmill,Weighted Ball Hyperextension,Weighted Ball Side Bend,Weighted Bench Dip,Weighted Crunches,Weighted Jump Squat,Weighted Pull Ups,Weighted Sissy Squat,Weighted Sit-Ups - With Bands,Weighted Squat,Wide-Grip Barbell Bench Press,Wide-Grip Decline Barbell Bench Press,Wide-Grip Decline Barbell Pullover,Wide-Grip Lat Pulldown,Wide-Grip Pulldown Behind The Neck,Wide-Grip Rear Pull-Up,Wide-Grip Standing Barbell Curl,Wide Stance Barbell Squat,Wide Stance Stiff Legs,Wind Sprints,Windmills,World's Greatest Stretch,Wrist Circles,Wrist Roller,Wrist Rotations with Straight Bar,Yoke Walk,Zercher Squats,Zottman Curl,Zottman Preacher Curl."

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
                //logs: { type: "string", description: "Raw lines: 'YYYY-MM-DD | Exercise | reps@weight, ... | [BW=kg]'" },
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
                        bloodType: { type: "string" },
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
                model: "gpt-5-nano",
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

    const createWorkoutProgram = (message, unit) => {
        try {
            $app.logger().warn('Calling workout creation ***', message, unit);
            return $http.send({
                url: "https://api.openai.com/v1/responses",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.OPENAI_API_KEY
                },
                body: JSON.stringify({
                    model: "gpt-5-mini",
                    instructions:
                        "Unit of measurement is: " + unit + "." +
                        "Available exercises: " + EXERCISES + "." +
                        "Create a detailed workout plan based on this message: " + message +
                        "Return ONLY valid JSON matching the schema. Use only from available exercises list.",
                    text: {
                        format: {
                            type: "json_schema",
                            name: "WorkoutProgram",
                            strict: true,
                            schema: {
                                type: "object",
                                properties: {
                                    numberOfWeeks: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
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
                                required: ["days", "numberOfWeeks", "name", "description"],
                                additionalProperties: false
                            }
                        }
                    },
                    input: [{ role: "user", content: "Generate the workout per schema for: " + message }]
                })
            });
        } catch (error) {
            $app.logger().error(error);
            return null;
        }
    }

    const createMealPlan = (message, unit) => {
        return $http.send({
            url: "https://api.openai.com/v1/responses",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-5-nano",
                instructions:
                    "Unit is: " + unit +
                    ". Create a meal plan based on this message: " + message +
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
                model: "gpt-5-nano",
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
                model: "gpt-5-nano",
                instructions: `You are an AI personal trainer. Ask short questions to fill required fields for create_workout_program. When ready, call the tool. If user asks about meal plan, ask to fill some fields and call create_meal_plan. If user asks for workout progress analyze call analyze_progress.`,
                tools: [CREATE_WORKOUT_PROGRAM_SCHEMA, ANALYZE_PROGRESS_SCHEMA, CREATE_MEAL_PLAN_SCHEMA],
                tool_choice: "auto",
                input: [...msgs]
            })
        });
    }

    const getKgsOrLbs = () => {
        const weightType = new DynamicModel({
            defaultWeightType: -0,
        });

        $app.db()
            .newQuery(`SELECT defaultWeightType FROM users WHERE user={:user}`)
            .bind({ "user": e.record.id }).one(weightType);

        return weightType.defaultWeightType == 2 ? 'kg' : 'lb';
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
                .filter(c => c.type === "function_call")
                .map(c => ({
                    name: c.tool_call?.name,
                    args: JSON.parse(c.tool_call?.arguments || "{}"),
                    tool_call_id: c.tool_call?.id
                }));
        }

        const call = calls[0];

        if (call && call.name === "create_workout_program") {


            const kgsOrLbs = getKgsOrLbs();

            const wo = createWorkoutProgram(JSON.stringify(call.args || call.arguments), kgsOrLbs);

            if (wo.statusCode != 200) {
                $app.logger().error(wo.raw)
            }

            if (!wo) {
                e.next()
                return;
            }

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

            $app.logger().warn("Calling create meal", JSON.stringify(call.args || call.arguments))

            const kgsOrLbs = getKgsOrLbs();

            const mp = createMealPlan(JSON.stringify(call.args || call.arguments), kgsOrLbs);

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
                               WHERE s.created >= DATE('now', '-35 days') AND user={:user}`)
                    .bind({
                        "user": e.record.id
                    })
                    .all(rows);

                $app.db()
                    .newQuery(`SELECT defaultWeightType
                               FROM users WHERE user={:user}`)
                    .bind({
                        "user": e.record.id
                    })
                    .one(weightType);

            } catch (error) {
                $app.logger().error(error)
                e.next();
            }

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