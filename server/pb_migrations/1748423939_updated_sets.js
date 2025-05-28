/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "bool2458132080",
    "name": "restSkipped",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("bool2458132080")

  return app.save(collection)
})
