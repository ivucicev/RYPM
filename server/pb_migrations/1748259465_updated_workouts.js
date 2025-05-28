/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool989355118",
    "name": "completed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("u01gz4m571bnw0d")

  // remove field
  collection.fields.removeById("bool989355118")

  return app.save(collection)
})
