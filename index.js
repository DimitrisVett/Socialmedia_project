const express = require("express");
const app = express();
const db = require("./utils/db");
const { hash, compare } = require("./utils/bs");
const compression = require("compression");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
///////////////////////////upload stuff////////////////////////////
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////////////////middlewares//////////////////////////////
app.use(compression());
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(express.json());
////////////////////////csurf/////////////////////////////////////
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
//////////////////////////////////////////////////////////////////
app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////////////////////////////////routes///////////////////////////////

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const imgUrl = `${s3Url}${req.file.filename}`;
    db.addProfPic(imgUrl, req.session.userId)
        .then(() => {
            res.json({ imgUrl: imgUrl });
        })
        .catch(er => {
            console.log(er);
            res.json({ error: er });
        });
});

app.post("/welcome", (req, res) => {
    console.log("body", req.body);
    console.log("register post here");
    let firstName = req.body.first;
    let lastName = req.body.last;
    let email = req.body.email;
    let pass = req.body.password;
    hash(pass)
        .then(hashedPass => {
            db.addUser(firstName, lastName, email, hashedPass)
                .then(({ rows }) => {
                    if (req.session.signId) {
                        req.session.signId = null;
                    }
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                })
                .catch(er => {
                    console.log(er);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    console.log("post login here");
    let pass = req.body.password;

    db.getUser(req.body.email)
        .then(({ rows }) => {
            compare(pass, rows[0].password)
                .then(val => {
                    if (val) {
                        req.session.userId = rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log("email or password is wrong", err);
        });
});

app.get("/infos", function(req, res) {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            // console.log("rows in info", rows[0]);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/user.json/:id", function(req, res) {
    db.getUserInfo(req.params.id)
        .then(({ rows }) => {
            rows[0].meId = req.session.userId;
            res.json(rows[0]);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/users.json/:users", function(req, res) {
    db.findUser(req.params.users)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/users.json/", function(req, res) {
    db.recentUser()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/bio", (req, res) => {
    db.addBio(req.body.bio, req.session.userId)
        .then(() => {
            res.json({ bio: req.body.bio });
        })
        .catch(er => {
            console.log(er);
            res.json({ error: er });
        });
});

app.get("/friendsstatus/:otherid", (req, res) => {
    db.seeRelation(req.session.userId, req.params.otherid)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({ buttonText: "make friend request" });
            } else {
                if (rows[0].accepted) {
                    res.json({ buttonText: "remove friend", accepted: true });
                } else {
                    if (req.session.userId == rows[0].sender_id) {
                        res.json({ buttonText: "cancel friend request" });
                    } else {
                        res.json({ buttonText: "accept friend " });
                    }
                }
            }
        })
        .catch(er => {
            console.log(er);
            res.json({ error: er });
        });
});

app.post("/friendsstatus/:otherid", (req, res) => {
    db.seeRelation(req.session.userId, req.params.otherid)
        .then(({ rows }) => {
            if (rows.length == 0) {
                db.insertRelation(req.session.userId, req.params.otherid)
                    .then(() => {
                        res.json({ buttonText: "cancel friend request" });
                    })
                    .catch(er => {
                        console.log(er);
                        res.json({ error: er });
                    });
            } else {
                if (rows[0].accepted) {
                    db.deleteFriendship(rows[0].id)
                        .then(() => {
                            res.json({ buttonText: "make friend request" });
                        })
                        .catch(er => {
                            console.log(er);
                            res.json({ error: er });
                        });
                } else {
                    if (req.session.userId == rows[0].sender_id) {
                        db.deleteFriendship(rows[0].id)
                            .then(() => {
                                res.json({ buttonText: "make friend request" });
                            })
                            .catch(er => {
                                console.log(er);
                                res.json({ error: er });
                            });
                    } else {
                        db.updateFriendship(rows[0].id)
                            .then(() => {
                                res.json({ buttonText: "remove friend " });
                            })
                            .catch(er => {
                                console.log(er);
                                res.json({ error: er });
                            });
                    }
                }
            }
        })
        .catch(er => {
            console.log(er);
            res.json({ error: er });
        });
});

app.get("/relationships", function(req, res) {
    db.seeFriends(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/relationships/:otherid", function(req, res) {
    console.log("post relationships happend");
    db.seeFriends(req.params.otherid)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/logout", function(req, res) {
    console.log("logged out");
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

io.on("connection", function(socket) {
    console.log("socket id", socket.id);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    db.getMessages()
        .then(({ rows }) => {
            io.sockets.emit("chatMessages", rows.reverse());
        })
        .catch(error => console.log(error));

    socket.on("myMsg", msg => {
        db.addMessage(userId, msg).then(data => {
            db.getUserInfo(userId).then(({ rows }) => {
                rows[0].chats_id = data.rows[0].id;
                rows[0].msg = msg;
                rows[0].password = "";
                rows[0].sender_id = userId;
                io.sockets.emit("chatMessage", rows[0]);
            });
        });
    });
});
