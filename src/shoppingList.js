require("dotenv").config();
const knex = require("knex");
const ShoppingListService = require("./shopping-list-service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.TEST_DB_URL,
});

// use all the ShoppingListService methods!!
ShoppingListService.getAllListItems(knexInstance)
  .then((items) => console.log(items))
  .then(() =>
    ShoppingListService.insertListItem(knexInstance, {
      name: "BRAND NEW NAME",
      price: "699.69",
      date_added: new Date(),
      checked: false,
      category: "Snack",
    })
  )
  .then((newItem) => {
    console.log(newItem);
    return ShoppingListService.updateItem(knexInstance, newItem.id, {
      name: "UPDATED NAME",
    }).then(() => ShoppingListService.getById(knexInstance, newItem.id));
  })
  .then((item) => {
    console.log(item);
    return ShoppingListService.deleteItem(knexInstance, item.id);
  });
