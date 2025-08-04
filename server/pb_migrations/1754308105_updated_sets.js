/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("number2717951442")

  // add field
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

  // update field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number3134425357",
    "max": 10,
    "min": 0,
    "name": "RiRorRPE",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "number2717951442",
    "max": 10,
    "min": 0,
    "name": "rir",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("number1372861645")

  // update field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number3134425357",
    "max": 10,
    "min": 0,
    "name": "rpe",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
