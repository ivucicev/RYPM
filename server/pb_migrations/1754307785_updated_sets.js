/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("number3134425357")

  return app.save(collection)
})
