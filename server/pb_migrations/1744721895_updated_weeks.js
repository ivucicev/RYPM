/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j0bfxgls",
    "name": "index",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q2ebot9h3dm6uf0")

  // remove
  collection.schema.removeField("j0bfxgls")

  return dao.saveCollection(collection)
})
