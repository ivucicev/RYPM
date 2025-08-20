/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/push-subscribe", (e) => {

    let body =  e.requestInfo().body;

    const res = $http.send({
        url: "https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-89192d39-2123-4764-971d-34f42a9a81ea/rypm/subs",
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
