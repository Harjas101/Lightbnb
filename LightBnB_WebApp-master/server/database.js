const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

/// Users
// const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env
// console.log(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE)

const pool = new Pool({
  user: "labber",
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
})

pool
  .connect()
  .then(() => console.log("connected"))
  .catch(err => console.error("connection error", err.stack));

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})
.catch(err => console.error('query error', err.stack));

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  // 3a city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }
  //3b owner id
  console.log("owner.id", options)
  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += ` AND owner_id LIKE $${queryParams.length}`;
  }
  //3c min price
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += ` AND cost_per_night >= $${queryParams.length}`;
  }
  //3d max price
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += ` AND cost_per_night <= $${queryParams.length}`;
  }
  queryString += `GROUP BY properties.id `
  console.log("options", options)
  //3e min rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating)
    queryString += ` HAVING avg(rating) >= $${queryParams.length}\n`;
  }
  // 4
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  // 5
  console.log(queryString, queryParams);
  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows)

}
exports.getAllProperties = getAllProperties;
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
