BUGS -
     - [x] Starting exersize from new workoute causes eror Effort required
     - [x] when in workout selected weight is zero then you have to scroll !HIGH all the way
     - [x] When previewing done day - going edit program clicking on day - all values are 0
     - [x] all exercises complete even if one left (shown on home screen), if on previous scren where actually are all checked
     - [x] Move exercise up and down doest work on program and exercise
     - [x] Move up and down blocked if only 2 items
     - [x] no 14 16 18 in increments increments in general messed up
     - [x] updating weight increments should be immediately available
     - [x] start and end of workout wrong times -2h, UTC issue
     - [x] Adding custom excersiz not visible immediatelly in selct excersizes screen
     - [x] ability to edit workout on the spot if selected wrong on program
     - [?] No need to select weight when creating program... not sure, maybe this OK
     - [x] cannot add new exercize while workout is active
     - [x] CONFIRM DELETION of template, program, exercise
     - [x] Lgout opens logub in modal
     - [x] Logout opens modal instead of navigating
     - [x] Swipe Back Issue double animations 
     - [x] Verify Account Url
     - [x] stats - better for exercises filter by exercise
     - [x] keep display on
     - [x] Progress pictures in measurements
     - [x] wake lock not working
     - [x] add photo doesnt reload images
     - [x] 'Progress photo' breaksin the new row
     - [x] share workout
     - [x] better summary after complete
     - [x] better preview of completed exercise not edit
     - [x] no of weeks
     - [x] period select
     - [x] load per miscle group
     - [x] fix program creation from AI program
     - [x] Fix NGINX config collision with SW
     - [ ] When creating program - adding lots of weeks causes 404 in console and lots of requests !HIGH prio -too many requests in general, i think server would crash with 1.5 active users
     - [ ] Navigating exercise left and right calls N requests ever time, even if nothing is changed  !HIGH
     - [ ] EDITING DONE WORKOUT WORKS LIKE DOG SHIT - doesnt work, creates random exercises and deletes old ones very WTF functionallity also updates navigating left and right for no reason
     - [ ] Calling Continue workout from program calls so many requests that i get 429 error from the API !HIGH
     - [ ] bandwidth -> saving sends whole object insead of patched fields
     - [ ] editing workout program -> setting values wrong value in picker [confusing]
     - [ ] going to next page calls 6 requests
     - [ ] setting completed false on whole exercise  when it is already false
     - [ ] continue footer missing
     - [ ] start workout batch creating sets
     - [ ] home screen opening popover fetches programs again?
     - [ ] starting workout calls collection/sets and returns empty
     - [ ] (?) put continue footer in tabs page so there are less frequent requests
     - [ ] (?) active workout (from wizard) service? used in multiple places, handle locally for less freq. requests

UI/UX BUGS
     - [x] On openning app first login showed
     - [ ] Safari ios white theme - installation screen not visible
     - [ ] first time navigating to safari ios not showing installation button
    
AI BUGS
    - [x] Suggested program doesnt match generated program, example i said 1 day per week -> generates 4 days a week
    - [x] Analyze progress also doesnt work correctly, it doesnt use the function as it should
    - [x] Test create meal plan
    - [x] Plan creation failed on prod - check my data again

Workouts screen - 
    - [x] Add program complete test [ok]
    - [x] Add template complete test [ok]
    - [x] New empty excersize [ok]
    - [x] Do whole program test [ok]
    - [x] When just checking chekmark without selecting values on active workout it set reps and values as 0 []
    - [x] Rate traingin day after completing day (perceived rating 1-10, 1-bad, 10-all out), also to add some comment
    - [X] adding multiple excersizes with search causes selected excersizes to deselect
    - [x] Reorder workouts on day
    - [X] three dots on new program do not work 
    - [x] adding description to workout, that will not be propagated to next workout
    - [x] Rest timer does not get copied when copying or duplicating
    - [x] RPE i RiR
    - [x] AMRAP (== max.)
    - [x] Drop Sets
    - [x] Super Sets

Activity screen -
    - [x] Volume -> over time
    - [x] Volume -> over time per workout
    - [x] Volume -> overtime per workout Max.
    - [x] Effort -> over time
    - [x] Measurements all custom

Chat -
    - [x] AI Trainer
    - [ ] Human Trainer
    - [ ] Chat in general

Settings -
    - [x] plates -> for increments
    - [x] measurements -> custom -> add whatever custom name
    - [x] Chat with us, help us improve / contact...
    - [x] Terms & Conditions
    - [x] Account settings
    - [x] Mfa Login
    - [ ] Languages & Translations
    - [ ] profile -> public/pictures...

General -
    - [x] PWA Setup 
    - [x] Docker deploy
    - [x] Name, Domain
    - [x] Gihub actions
    - [x] Repo Transfer
    - [x] Social Login
    - [x] Google
    - [x] Github
    - [x] Microsoft
    - [?] FB [POSTPONED]
    - [?] Apple [POSTPONED]
    - [ ] PWA notifications for Rest timer
    - [ ] White labeling
    - [ ] Marketing website

Admin / Trainer -
    - [ ] TBD
    - [ ] Trainer profile
    - [ ] Trainer chat
    - [ ] Trainer part in general

Features & Ideas
    - [ ] Meal planner weekly, monthly with grocery store list... based on your dietary restrictions and weight and goal to go with supporting workout plan recovery
    - [ ] Meal planner with tickboxes like Breeakfast [x] Eggs 4x & Tuna 50g & Rice 18g
    - [ ] Meal planner shopping list based on monthly meal plan