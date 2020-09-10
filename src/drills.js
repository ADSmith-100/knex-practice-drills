require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

console.log("knex and driver installed correctly");

const searchTerm = "Fish";

function searchByProductName(searchTerm) {
  knexInstance
    .select("name")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

//searchByProductName(`${searchTerm}`);

function paginateProducts(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select("name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

//paginateProducts(2);

function itemsAddedAfter(daysAgo) {
  knexInstance
    .select("name", "price", "date_added", "checked", "category")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )

    .from("shopping_list")
    .then((result) => {
      console.log(result);
    });
}

//itemsAddedAfter(1);

function costPerCategory() {
  knexInstance
    .select("category")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then((result) => {
      console.log("COST PER CATEGORY");
      console.log(result);
    });
}

costPerCategory();
