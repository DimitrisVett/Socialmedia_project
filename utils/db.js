var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialmedia"
);

module.exports.addUser = function addUser(
    firstname,
    lastname,
    email,
    password
) {
    firstname = firstname[0].toUpperCase() + firstname.slice(1).toLowerCase();

    lastname = lastname[0].toUpperCase() + lastname.slice(1).toLowerCase();

    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [firstname, lastname, email, password]
    );
};

module.exports.getUser = function getUser(email) {
    return db.query("SELECT password, id FROM users WHERE  email=$1", [email]);
};

module.exports.getUserInfo = function getUserInfo(id) {
    return db.query("SELECT *  FROM users WHERE  id=$1", [id]);
};

module.exports.addProfPic = function addProfPic(imgUrl, id) {
    return db.query("UPDATE users SET imgurl=$1  WHERE  id=$2 ", [imgUrl, id]);
};

module.exports.addBio = function addProfPic(bio, id) {
    return db.query("UPDATE users SET bio=$1  WHERE  id=$2 ", [bio, id]);
};

module.exports.findUser = function findUser(name) {
    return db.query(`SELECT * FROM users WHERE first ILIKE $1  LIMIT 4;`, [
        name + "%"
    ]);
};

module.exports.recentUser = function recentUser() {
    return db.query(`SELECT * FROM users  ORDER BY id DESC LIMIT 4;`);
};

module.exports.seeRelation = function seeRelation(currentId, otherId) {
    return db.query(
        `SELECT * FROM friendships
WHERE (receiver_id = $1 AND sender_id = $2)
OR (receiver_id = $2 AND sender_id = $1)
`,
        [currentId, otherId]
    );
};

module.exports.insertRelation = function InsertRelation(currentId, otherId) {
    return db.query(
        `INSERT INTO friendships (sender_id ,receiver_id  )VALUES ($1,$2);
`,
        [currentId, otherId]
    );
};

module.exports.updateFriendship = function UpdateFriendship(tableId) {
    return db.query(
        `UPDATE friendships SET accepted = TRUE WHERE id =$1;
`,
        [tableId]
    );
};

module.exports.deleteFriendship = function UpdateFriendship(tableId) {
    return db.query(
        `DELETE FROM friendships  WHERE id =$1;
`,
        [tableId]
    );
};

module.exports.seeFriends = function seeFriends(currentId) {
    return db.query(
        `SELECT users.id, first, last, imgurl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id= $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`,
        [currentId]
    );
};

module.exports.getMessages = function getMessages() {
    return db.query(
        "SELECT *, chats.id AS chats_id FROM chats LEFT JOIN users ON (sender_id = users.id) ORDER BY chats.id DESC LIMIT 10;"
    );
};

module.exports.addMessage = function addMessage(id, msg) {
    return db.query(
        "INSERT INTO chats (sender_id, msg) VALUES ($1, $2) RETURNING id;",
        [id, msg]
    );
};
