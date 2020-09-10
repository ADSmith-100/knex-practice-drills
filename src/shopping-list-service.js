const ShoppingListService = {
  getAllListItems(knex) {
    return knex.select("*").from("shopping_list_test");
  },

  insertListItem(knex, newListItem) {
    return knex
      .insert(newListItem)
      .into("shopping_list_test")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("shopping_list_test").select("*").where("id", id).first();
  },
  deleteItem(knex, id) {
    return knex("shopping_list_test").where({ id }).delete();
  },
  updateItem(knex, id, newItemFields) {
    return knex("shopping_list_test").where({ id }).update(newItemFields);
  },
};

module.exports = ShoppingListService;
