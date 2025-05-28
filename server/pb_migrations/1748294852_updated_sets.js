/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "date1718663312",
    "max": "",
    "min": "",
    "name": "completedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("date1718663312")

  return app.save(collection)
})
