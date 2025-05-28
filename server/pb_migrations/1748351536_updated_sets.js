/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "bool1546204380",
    "name": "isRest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("bool1546204380")

  return app.save(collection)
})
