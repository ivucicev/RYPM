/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove field
  collection.fields.removeById("relation3852478864")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "gn8v3g1b422i7ig",
    "hidden": false,
    "id": "relation3852478864",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "day",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
