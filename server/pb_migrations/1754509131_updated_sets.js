/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // remove field
  collection.fields.removeById("select2067716019")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("miwt2r3am6w9roy")

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "select2067716019",
    "maxSelect": 1,
    "name": "superset",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ]
  }))

  return app.save(collection)
})
