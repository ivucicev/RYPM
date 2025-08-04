/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // update field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number3134425357",
    "max": 10,
    "min": 1,
    "name": "rir",
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
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number3134425357",
    "max": 10,
    "min": 0,
    "name": "riRorRPE",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
