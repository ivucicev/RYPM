/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "u01gz4m571bnw0d",
    "hidden": false,
    "id": "relation1688206194",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "workout",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "u01gz4m571bnw0d",
    "hidden": false,
    "id": "relation1688206194",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "activeWorkout",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
