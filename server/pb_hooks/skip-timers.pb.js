/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/skip-timers/user/{id}", (e) => {

    let id = e.request.pathValue("id")

    $app.db().update('notifications', { state: 'cancelled' },
        $dbx.and($dbx.exp(`"to" = {:id}`, { id: id }),
            $dbx.exp(`state = "prepared"`),
            $dbx.exp(`type = "timer"`)))
        .execute();

    return e.json(200, { "message": "ok" });
})
