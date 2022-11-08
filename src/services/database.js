const db = require("../config/db.config").db;

// Expects either `userId` as Number or `username` as String.
// If neither are passed in, will throw an error.
// Returns all columns of user table.
// Does not handle errors.
exports.getUser = async ({userId, username}) => {
  if (userId) {
    return await db.task(`getUser-${userId}`, async task => {
      return await task.one("SELECT * FROM users WHERE userId = $1;", [userId]);
    });
  } else if (username) {
    return await db.task(`getUser-${username}`, async task => {
      return await task.one("SELECT * FROM users WHERE username = $1;", [username]);
    });
  } else {
    throw Error("Did not pass correct parameters!");
  }
};

// Expects `chatName` as String, `limit` as Number.
// Chat names are determined from table name in `create.sql`. Refer to `create.sql` for more info on the chat names.
// Limit is optional but recommended.
// Returns all columns of specified chat table.
// Does not handle errors.
exports.getChat = async ({chatName, limit}) => {
  return await db.task(`get${chatName}Chat-${limit ? limit : ""}`, async task => {
    return await task.many(`SELECT * FROM ${chatName}chat${limit ? " LIMIT " : ""}${limit ? limit : ""};`);
  });
};

// Expects `userId` as Number.
// Returns all columns of userPerks table.
// Does not handle errors.
exports.getPerks = async ({userId}) => {
  return await db.task(`getUserPerks-${userId}`, async task => {
    return await task.many("SELECT * FROM userPerks WHERE userId = $1;", [userId]);
  });
};

// Expects `username` as String, `password` as hashed string, `isAdmin` as boolean, `points` as Number, and `profilePicture` as String/
// `isAdmin`, `points`, and `profilePicture` are not required.
// Returns void.
// Does not handle errors.
exports.newUser = async ({username, password, isAdmin = false, points = 0, profilePicture = ""}) => {
  await db.task(`newUser-${username}`, async task => {
    const {userid} = await task.one("INSERT INTO users(username, password, isAdmin, points, profilePicture) VALUES ($1, $2, $3, $4, $5) RETURNING userId;", [username, password, isAdmin, points, profilePicture]);
    await task.none("INSERT INTO userPerks(userId, font, border, profilePicture, nameColor) VALUES ($1, $2, $3, $4, $5);", [userid, "", "", "", ""]);
  });
};

// Expects `chatName` as String, `userId` as Number, `message` as String.
// Returns void.
// Does not handle errors.
exports.newChat = async ({chatName, userId, message}) => {
  await db.task(`new${chatName}Chat-${userId}`, async task => {
    await task.none(`INSERT INTO ${chatName}chat(message, time, userId) VALUES ($1, NOW(), $2);`, [message, userId]);
  });
};

// Expects `userId` as Number and `username` as String.
// Returns the deleted user object.
exports.deleteUser = async ({userId, username}) => {
  if (userId) {
    return await db.task(`deleteUser-${userId}`, async task => {
      try {
        await task.none("DELETE FROM generalchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM sportschat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM travelchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM programmingchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM userPerks WHERE userId = $1;", [userId]);
      } catch (err) {
        if (err.message === "No data returned from the query.") {
          console.log(err);
        } else {
          throw err;
        }
      }
      return await task.one("DELETE FROM users WHERE userId = $1 RETURNING *;", [userId]);
    });
  } else if (username) {
    return await db.task(`deleteUser-${username}`, async task => {
      const {userid: userId} = await task.one("SELECT userId FROM users WHERE username = $1;", [username]);
      try {
        await task.none("DELETE FROM generalchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM sportschat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM travelchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM programmingchat WHERE userId = $1;", [userId]);
        await task.none("DELETE FROM userPerks WHERE userId = $1;", [userId]);
      } catch (err) {
        if (err.message === "No data returned from the query.") {
          console.log(err);
        } else {
          throw err;
        }
      }
      return await task.one("DELETE FROM users WHERE username = $1 RETURNING *;", [username]);
    });
  } else {
    throw Error("Did not pass correct parameters!");
  }
}

// Expects `chatName` as String and `messageId` as Number.
// Returns the chat object.
// Does not handle errors.
exports.deleteChat = async ({chatName, messageId}) => {
  await db.task(`delete${chatName}Chat-${messageId}`, async task => {
    return await task.one(`DELETE FROM ${chatName}chat WHERE messageId = $1 RETURNING *;`, [messageId]);
  });
};

// Expects `userId` as Number, `username` as String, `password` as String, `isAdmin` as bool, `points` as Number, `profilePicture` as String.
// Returns user object.
// Does not handle errors.
exports.updateUser = async ({userId, username, password, isAdmin, points, profilePicture}) => {
  const query = "UPDATE users SET ";
  var comma = "";
  var updated = false;
  if (username) {
    query += `username = ${username}`;
    comma = ", ";
    updated = true;
  }
  if (password) {
    query += comma + `password = ${password}`;
    comma = ", ";
    updated = true;
  }
  if (isAdmin) {
    query += comma + `isAdmin = ${isAdmin}`;
    comma = ", ";
    updated = true;
  }
  if (points) {
    query += comma + `points = ${points}`;
    comma = ", ";
    updated = true;
  }
  if (profilePicture) {
    query += comma + `profilePicture = ${profilePicture}`;
    comma = ", ";
    updated = true;
  }
  if (!updated) {
    throw Error("Did not pass values to update perks!");
  }
  query += ` WHERE userId = ${userId} RETURNING *;`;
  await db.task(`updateUser-${userId}`, async task => {
    return await task.one(query);
  });
};

// Expects `userId` as Number, `font` as String, `border` as String, `profilePicture` as String, and `nameColor` as String.
// Returns an object with all perks.
// Does not handle errors.
exports.updatePerks = async ({userId, font, border, profilePicture, nameColor}) => {
  const query = "UPDATE userPerks SET ";
  var comma = "";
  var updated = false;
  if (font) {
    query += `font = ${font}`;
    comma = ", ";
    updated = true;
  }
  if (border) {
    query += comma + `border = ${border}`;
    comma = ", ";
    updated = true;
  }
  if (profilePicture) {
    query += comma + `profilePicture = ${profilePicture}`;
    comma = ", ";
    updated = true;
  }
  if (nameColor) {
    query += comma + `nameColor = ${nameColor}`;
    updated = true;
  }
  if (!updated) {
    throw Error("Did not pass values to update perks!");
  }
  query += ` WHERE userId = ${userId} RETURNING *;`;
  await db.task(`updatePerks-${userId}`, async task => {
    return await task.one(query);
  });
};
