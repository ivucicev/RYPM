/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool2726931391",
    "name": "aiProgram",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // remove field
  collection.fields.removeById("bool2726931391")

  return app.save(collection)
})
