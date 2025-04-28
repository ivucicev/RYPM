/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zy6uvnvw",
    "name": "numberOfWeeks",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e0jve7y1d9cj2sl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zy6uvnvw",
    "name": "numberOfWeeks",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
})
