const db = require("../config/db.config").db;

// Expects either `userId` as Number or `username` as String.
// If neither are passed in, will throw an error.
// Returns all columns of user table.
// Does not handle errors.
exports.getUser = async (userId, username) => {
  if (userId) {
    return await db.task(`getUser-${userId}`, async task => {
      return await task.any("SELECT * FROM users WHERE userId = $1;", [userId]);
    });
  } else if (username) {
    return await db.task(`getUser-${username}`, async task => {
      return await task.any("SELECT * FROM users WHERE username = $1;", [username]);
    });
  } else {
    throw Error("Did not pass in correct parameters!");
  }
};

// Expects `chaName` as String, `limit` as Number.
// Chat names are determined from table name in `create.sql`. Refer to `create.sql` for more info on the chat names.
// Limit is optional but recommended.
// Returns all columns of specified chat table.
// Does not handle errors.
exports.getChat = async (chatName, limit) => {
  return await db.task(`get${chatName}Chat-${limit ? limit : ""}`, async task => {
    return await task.any(`SELECT * FROM ${chatName}chat${limit ? " LIMIT " : ""}${limit ? limit : ""};`);
  });
};

// Expects `userId` as Number.
// Returns all columns of userPerks table.
// Does not handle errors.
exports.getPerks = async (userId) => {
  return await db.task(`getUserPerks-${userId}`, async task => {
    return await task.any("SELECT * FROM userPerks WHERE userId = $1;", [userId]);
  });
};

exports.newUser = async (username, password, isAdmin, points, profilePicture) => {
  await db.task(`newUser-${username}`, async task => {
    await task.none("INSERT INTO users(username, password, isAdmin, points, profilePicture) VALUES ($1, $2, $3, $4, $5);", [username, password, isAdmin ? true : false, points ? points : 0, profilePicture ? profilePicture : ""]);
  });
};

// Expects `chatName` as String, `userId` as Number, `message` as String.
// Returns void.
// Does not handle errors.
exports.newChat = async (chatName, userId, message) => {
  await db.task(`new${chatName}Chat-${userId}`, async task => {
    await task.none(`INSERT INTO ${chatName}chat(message, time, userId) VALUES ($1, NOW(), $2);`, [message, userId]);
  });
};