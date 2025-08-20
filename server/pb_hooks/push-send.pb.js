/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/push-send", (e) => {

    let token = e.request.url.query().get("token")
    let duration = e.request.url.query().get("duration")
    let body =  e.requestInfo().body;

    //send fire and forget
    setTimeout(() => {
        $http.send({
            url: "https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-89192d39-2123-4764-971d-34f42a9a81ea/rypm/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
     
    }, parseInt(duration))
    return e.json(200, {})

})
