const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Items service object`, function () {
  let db;

  let testItems = [
    {
      id: 1,
      name: "Item one",
      price: "0.69",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main",
    },
    {
      id: 2,
      name: "Item two",
      price: "1.69",
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      checked: true,
      category: "Lunch",
    },
    {
      id: 3,
      name: "Item one",
      price: "0.69",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      checked: false,
      category: "Breakfast",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db("shopping_list_test").truncate());

  afterEach(() => db("shopping_list_test").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list_test' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list_test").insert(testItems);
    });

    it(`updateItem() updates an item from the 'shopping_list_test' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "UPDATED NAME",
        price: "59.69",
        date_added: new Date("1919-12-22T16:28:32.615Z"),
        checked: true,
        category: "Main",
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then((item) => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          });
        });
    });

    it(`deleteItem() removes an item by id from 'shopping_list_test' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllListItems(db))
        .then((allItems) => {
          // copy the test items array without the "deleted" article
          const expected = testItems.filter((item) => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`getById() resolves an item by id from 'shopping_list_test' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestItem.name,
          price: thirdTestItem.price,
          date_added: thirdTestItem.date_added,
          checked: thirdTestItem.checked,
          category: thirdTestItem.category,
        });
      });
    });

    it(`getAllListItems() resolves all items from 'shopping_list_test' table`, () => {
      // test that ShoppingListService.getAllListItems gets data from table
      return ShoppingListService.getAllListItems(db).then((actual) => {
        expect(actual).to.eql(testItems);
      });
    });
  });

  context(`Given 'shopping_list_test' has no data`, () => {
    it(`getAllListItems() resolves an empty array`, () => {
      return ShoppingListService.getAllListItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertListItem() inserts a new list item and resolves the new list item with an 'id'`, () => {
      const newListItem = {
        id: 1,
        name: "Super Test ITEM",
        price: "6969.69",
        date_added: new Date("1919-10-22T16:28:32.615Z"),
        checked: true,
        category: "Snack",
      };
      return ShoppingListService.insertListItem(db, newListItem);
    });
  });
});
