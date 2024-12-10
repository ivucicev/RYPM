/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/hello-world/hello", (e) => {
    let name = e.queryParam('name');

    return e.json(200, { "message": "Hello " + name })
})
