/**
 * Server connects to the database. Contains paths for registering, logging in, and logging out. Uses socket io for 
 * bidirectional communication between client and server. 
 */

const express = require("express")
const app = express()
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const session = require('express-session');


require('./config/passport')(passport);
const { ensureAuthenticated } = require('./config/authenticate');

const formatUserMessage = require("./userMessage/message.js");
const { userJoin, getCurrentUser, roomUsers,
    userLeave } = require("./userMessage/userStatus.js");

const adminName = "Admin"

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


///////////////////////Connecting to DB/////////////////////////////////

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

const User = require('./models/User');

////////////////////////////////////////Ensure Authentication/////////////////////////

app.get("/room", ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + "/html/room.html"));
})

app.get("/chat", ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + "/html/chat.html"));
})

////////////////////////////////////////Register/////////////////////////

app.post('/register', (req, res) => {
    let username = req.body.username;
    let newUser = null; // 1
    User.findOne({ username: username })
        .then(user => {

            if (user) {

                ///User exists
                throw new Error("Please use a different username");

            } else {
                newUser = new User(req.body);  // 2

                //Hash Password
                bcrypt.genSalt(10, function (err, salt) {  // 3
                    bcrypt.hash(newUser.password, salt, function (err, hash) {

                        if (err) throw err;
                        //Set password to hash
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                //Redirect to login
                                res.send({ result: user, message: "User saved to database" });
                            });
                    });
                });
            }
        })
        .catch(err => {
            res.status(401).json({
                error: {
                    errors: [{ msg: "Username exists" }]
                }
            });
        })
});

//////////////////////////////////////Login///////////////////////////////////

app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ error: { errors: [{ msg: info.message }] } }); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.json({ message: "success" });
        });
    })(req, res, next);
});

///////////////////////////////////LogOut//////////////////////////////////////

app.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: "success" });

});

/////////////////////////////////////Chat/////////////////////////////////////

io.on('connection', socket => {

    socket.on("joiningRoom", ({ room, nickname }) => {

        const user = userJoin(socket.id, room, nickname);
        socket.join(user.room);

        //To client
        socket.emit('message', formatUserMessage(adminName, "Hi There!!!"));

        //Broadcast user connection to all but the cient
        socket.broadcast
            .to(user.room)
            .emit('message', formatUserMessage(adminName, `${user.nickname} has joined the chat`));

        // Send users and room
        io
            .to(user.room)
            .emit('roomUsers', {
                room: user.room,
                users: roomUsers(user.room)
            });
    });


    //When user disconnects
    socket.on('disconnect', () => {
        let user = userLeave(socket.id);
        if (user) {
            io
                .to(user.room)
                .emit('message', formatUserMessage(adminName, `${user.nickname} has left the chat`));

            io
                .to(user.room)
                .emit('roomUsers', {
                    room: user.room,
                    users: roomUsers(user.room)
                });
        }
    });

    //Listen for message
    socket.on('chatInput', (msg) => {
        let user = getCurrentUser(socket.id);

        io
            .to(user.room)
            .emit('message', formatUserMessage(user.nickname, msg));
    });
});

///////////////////////////////////////////////////////////////////////////////////////

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/html/login.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Chat Server is listening at http://localhost:${port}`);
});