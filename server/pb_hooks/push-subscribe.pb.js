/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/push-subscribe", (e) => {

    let body =  e.requestInfo().body;

    const res = $http.send({
        url: process.env.PUSH_SUBSCRIBE_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (res.statusCode == 200 || res.statusCode == 201) {
        const data = res.json;
        return e.json(200, data)
    }

    return e.json(400, {})

})
