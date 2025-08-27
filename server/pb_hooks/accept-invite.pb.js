/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/invite/{code}", (e) => {

    let code = e.request.pathValue("code")

    $app.db().update('invites', { acceptedAt: new Date(), accepted: true },
        $dbx.and($dbx.exp(`"code" = {:code}`, { code: code }), $dbx.exp(`accepted = "false"`)))
        .execute();

    return e.json(200, { "message": "ok" });
})
