/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "number1372861645",
    "max": 10,
    "min": 1,
    "name": "rpe",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "number1372861645",
    "max": 3,
    "min": 1,
    "name": "reserveType",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
