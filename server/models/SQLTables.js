const priceTrackerDB = require('./priceTrackerModel.js');

//Table Queries:

const productsTable = `
  CREATE TABLE products (
    _id SERIAL,
    product_name VARCHAR NOT NULL,
    image_url VARCHAR NOT NULL,
    google_url VARCHAR UNIQUE,
    PRIMARY KEY (_id)
  )`;

// lowest_daily_price updated to varchar to avoid comma errors.
const lowestDailyPriceTable = `
  CREATE TABLE lowest_daily_price (
    _id SERIAL,
    product_id INT NOT NULL references products(_id),
    timestamp timestamp without time zone,
    store_name VARCHAR NOT NULL,
    lowest_daily_price VARCHAR,
    store_url VARCHAR NOT NULL,
    PRIMARY KEY (_id)
  )`;

const coupleTable = `
 CREATE TABLE couples (
   _id SERIAL,
   email VARCHAR UNIQUE,
   couple_username VARCHAR UNIQUE,
   password VARCHAR,
   PRIMARY KEY (_id)
 )
 `;

const coupleToProductsTable = ` 
  CREATE TABLE couple_to_products (
    _id SERIAL,
    couple_id INT NOT NULL references couples(_id),
    product_id INT NOT NULL references products(_id),
    on_hold BOOLEAN,
    PRIMARY KEY (_id)
  )`;

//On add:
//1. Add to the database.
//2. create a cron job to after x mins remove from database.
//3. remove from database at time limit
//4. emit that the item was removed from database, notifying web services using websocket.

//When the front end gets all products.
//1. Get the list of products that the couple has.
//2. For each product, checks if there is an entry in mongoDB for that product for that couple to be greyed out.
//Or we use websocket?

//in MongoDB
//Greyed Out Products
{
  _id; //from coupleToProductsTable
  on_hold; // maybe a timestamp that auto expires?
}

const sessionsTable = `
CREATE TABLE sessions (
  _id SERIAL,
  user_id INT NOT NULL references users(_id),
  ssid INT NOT NULL,
  PRIMARY KEY (_id)
)`;

//CREATE TABLE function:
async function createTable(queryString) {
  try {
    const result = await priceTrackerDB.query(queryString);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// createTable(productsTable)
// createTable(lowestDailyPriceTable)
// createTable(usersTable)
// createTable(usersToProductsTable)
// createTable(sessionsTable)

//**********************************************

//Insert into table Queries:

const productsInsert = `
INSERT INTO products (product_name, image_url) VALUES ( 'keyboard', 'www.keychron.com' )
`;

const lowestDailyPriceInsert = `
INSERT INTO lowest_daily_price (product_id, date, store_name, lowest_daily_price, store_url ) VALUES (1, '12/17/2020', 'Best Buy', 120.23, 'www.bestbuy.com' )
`;

const usersInsert = `INSERT INTO couples (email, password) VALUES ('test1@aol.com', 'monkey123')`;

const sessionsInsert = `
INSERT INTO sessions (user_id, ssid ) VALUES (1, 123)
`;

const usersToProductsInsert = `
INSERT INTO users_to_products (user_id, product_id ) VALUES (1, 1)
`;

//INSERT INTO TABLE function:
function insertIntoTable(queryString) {
  try {
    const result = priceTrackerDB.query(queryString);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// insertIntoTable(productsInsert);
// insertIntoTable(lowestDailyPriceInsert);
// insertIntoTable(usersInsert);
// insertIntoTable(sessionsInsert);
