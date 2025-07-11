/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "gn8v3g1b422i7ig",
    "hidden": false,
    "id": "yssquvme",
    "maxSelect": 2147483647,
    "minSelect": 0,
    "name": "days",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "gn8v3g1b422i7ig",
    "hidden": false,
    "id": "yssquvme",
    "maxSelect": 2147483647,
    "minSelect": 0,
    "name": "days",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
