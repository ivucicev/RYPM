/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_728114816")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\" && (participants ~ @request.auth.id)",
    "listRule": "  @request.auth.id != \"\" && (participants ~ @request.auth.id)",
    "updateRule": "@request.auth.id != \"\" && (participants ~ @request.auth.id)",
    "viewRule": "  @request.auth.id != \"\" && (participants ~ @request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_728114816")

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
