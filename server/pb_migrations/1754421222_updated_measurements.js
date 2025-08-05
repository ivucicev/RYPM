/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_638208807")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2868015847",
    "hidden": false,
    "id": "relation771273669",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "entries",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_638208807")

  // remove field
  collection.fields.removeById("relation771273669")

  return app.save(collection)
})
