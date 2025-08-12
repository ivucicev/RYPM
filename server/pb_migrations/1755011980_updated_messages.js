/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // remove field
  collection.fields.removeById("bool2267790479")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3713686397",
    "maxSize": 0,
    "name": "plan",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool2267790479",
    "name": "can_create_plan",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("json3713686397")

  return app.save(collection)
})
