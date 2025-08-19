/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "e0jve7y1d9cj2sl",
    "hidden": false,
    "id": "knhrtvue",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "program",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "e0jve7y1d9cj2sl",
    "hidden": false,
    "id": "knhrtvue",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "program",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
