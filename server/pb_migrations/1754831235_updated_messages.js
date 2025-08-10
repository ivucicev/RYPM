/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.id = from",
    "listRule": "  @request.auth.id != \"\" && (@request.auth.id = from || @request.auth.id = to)",
    "updateRule": "@request.auth.id != \"\" && @request.auth.id = from",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id = from || @request.auth.id = to)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
