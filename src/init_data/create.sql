DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password CHAR(60) NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  points INT NOT NULL,
  profilePictre TEXT NOT NULL
);

DROP TABLE IF EXISTS generalchat CASCADE;
CREATE TABLE generalchat (
  messageId SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  userId INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
);

DROP TABLE IF EXISTS sportschat CASCADE;
CREATE TABLE sportschat (
  messageId SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  userId INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
);

DROP TABLE IF EXISTS travelchat CASCADE;
CREATE TABLE travelchat (
  messageId SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  userId INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
);

DROP TABLE IF EXISTS programmingchat CASCADE;
CREATE TABLE programmingchat (
  messageId SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  userId INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
);

-- Default for not having them would be empty string
DROP TABLE IF EXISTS userPerks CASCADE;
CREATE TABLE userPerks (
  userId INT NOT NULL,
  font TEXT NOT NULL,
  border TEXT NOT NULL,
  profilePicture TEXT NOT NULL,
  nameColor TEXT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
);
