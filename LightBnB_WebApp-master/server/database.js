//const properties = require("./json/properties.json");
//const users = require("./json/users.json");
const { Client } = require("pg");

const pool = new Client({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb"
});

pool
  .connect()
  .then(() => console.log("connected"))
  .catch(err => console.error("connection error", err.stack));

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   console.log("user is aaa ", user);
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);

  // let user = pool
  return pool
    .query(
      `
          SELECT *
          FROM users
          WHERE email = $1;
        `,
      [email.toLowerCase()]
    )
    .then(res => res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(
      `
          SELECT *
          FROM users
          WHERE id = $1;
        `,
      [id]
    )
    .then(res => res.rows[0]);
};
// const getUserWithId = function (id) {
//   return pool
//     .query(`SELECT *
//   FROM users
//   WHERE id = $1
//   LIMIT 1`, [id])
//     .then(res => res.rows[0])
//     .catch((err) => console.log(err.message));
// }
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *`, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch((err) => console.log(err.message))
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`SELECT properties.*, reservations.*, avg(rating) as average_rating   FROM reservations   JOIN properties ON reservations.property_id = properties.id   JOIN property_reviews ON properties.id = property_reviews.property_id    WHERE reservations.guest_id = $1   AND reservations.end_date < now()::date   GROUP BY properties.id, reservations.id   ORDER BY reservations.start_date   LIMIT $2;`, [Number(guest_id), limit])
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
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
    where 1 = 1 
    `;
  // 3a city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }
  //3b owner id
  //console.log("owner.id", options)
  if (options.owner_id) {
    console.log('this is the number test')
    queryParams.push(`${Number(options.owner_id)}`);
    queryString += ` AND owner_id = $${queryParams.length}`;
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
  queryString += ` GROUP BY properties.id `
  // console.log("options", options)
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
  return pool.query(queryString, queryParams)
  .then((res) => {
    console.log('res rows are ', res.rows)
   return res.rows
  })
  // return pool
  //   .query(`SELECT * FROM properties LIMIT $1`, [limit])
  //   .then((result) => result.rows)
  //   .catch((err) => {
  //     console.log(err.message);
  //   });
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  console.log(property)
  return pool
    .query(`INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)   VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`, [property.owner_id, property.title , property.description,property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms ])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;

