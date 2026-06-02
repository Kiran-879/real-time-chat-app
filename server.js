const connection = require("./db");
const onlineUsers = {};

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");

const SECRET_KEY = "mysecretkey";

const app = express();

app.use(cors());
app.use(express.json());


// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);


// 🔥 ATTACH SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});


// 🔥 AUTH ROUTES
app.use("/api/auth", authRoutes);


// 🔥 TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server is running");
});




// 🔥 SOCKET AUTH MIDDLEWARE
io.use((socket, next) => {

    const token = socket.handshake.auth.token;

    // Check token exists
    if (!token) {
        return next(new Error("Authentication Error"));
    }

    try {

        // Verify JWT token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Store authenticated user
        socket.user = decoded;

        next();

    } catch (err) {

        return next(new Error("Invalid Token"));

    }

});




// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {

    const userId = socket.user.id;

    // 🔥 JOIN PERSONAL ROOM
    socket.join(userId.toString());



    // 🔥 STORE ONLINE USER
    onlineUsers[userId] = {
    socketId: socket.id,
    username: socket.user.username
};



    // 🔥 BROADCAST ONLINE USERS
    io.emit("onlineUsers", onlineUsers);



    console.log(`${socket.user.username} joined room ${userId}`);





    // 🔥 PRIVATE MESSAGE EVENT
    socket.on("privateMessage", ({ receiverId, message }) => {

        console.log(
            `${socket.user.username} sent message to ${receiverId}`
        );


        // 🔥 SAVE MESSAGE IN DATABASE
        const query = `
        INSERT INTO messages (sender_id, receiver_id, message)
        VALUES (?, ?, ?)
        `;

        connection.query(

            query,

            [socket.user.id, receiverId, message],

            (err, result) => {

                if (err) {

                    console.log("DB Error:", err);
                    return;

                }

                console.log("Message Saved");


                // 🔥 SEND MESSAGE TO RECEIVER
              io.to(receiverId.toString()).emit("receiveMessage", {

    sender: socket.user.username,
    message: message,
    created_at: new Date()

});


                // 🔥 SEND MESSAGE BACK TO SENDER
               socket.emit("receiveMessage", {

    sender: socket.user.username,
    message: message,
    created_at: new Date()

});

            }

        );

    });





    // 🔥 TYPING EVENT
    socket.on("typing", ({ receiverId }) => {

    if (!receiverId) {
        console.log("receiverId is null");
        return;
    }

    console.log(
        `${socket.user.username} is typing to ${receiverId}`
    );

    io.to(receiverId.toString()).emit("typing", {

        sender: socket.user.username

    });

});




    // 🔥 LOAD OLD CHAT HISTORY
    socket.on("loadMessages", ({ senderId, receiverId }) => {

    const query = `
    SELECT
        messages.*,
        users.username
    FROM messages
    JOIN users
        ON messages.sender_id = users.id
    WHERE
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
    `;

    connection.query(

        query,

        [
            senderId,
            receiverId,
            receiverId,
            senderId
        ],

        (err, results) => {

            if (err) {

                console.log("DB Fetch Error:", err);
                return;

            }

            console.log("Old messages loaded");

            // Send chat history
            socket.emit("chatHistory", results);

        }

    );

});



    // 🔥 DISCONNECT EVENT
    socket.on("disconnect", () => {

        console.log(`${socket.user.username} disconnected`);

        // Remove from online users
        delete onlineUsers[userId];

        // Broadcast updated online users
       io.emit("onlineUsers", onlineUsers);

    });

});




// 🔥 START SERVER
server.listen(5000, () => {

    console.log("Server running on port 5000");

});