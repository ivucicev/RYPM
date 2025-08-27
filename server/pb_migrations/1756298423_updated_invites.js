/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "[A-Z0-9]{6}",
    "hidden": false,
    "id": "text1997877400",
    "max": 6,
    "min": 6,
    "name": "code",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2452428166")

  // update field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "[A-Z0-9]{8}",
    "hidden": false,
    "id": "text1997877400",
    "max": 8,
    "min": 8,
    "name": "code",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
