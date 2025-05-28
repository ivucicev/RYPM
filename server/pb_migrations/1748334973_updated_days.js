/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "u01gz4m571bnw0d",
    "hidden": false,
    "id": "relation2774614240",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "workouts",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("gn8v3g1b422i7ig")

  // remove field
  collection.fields.removeById("relation2774614240")

  return app.save(collection)
})
