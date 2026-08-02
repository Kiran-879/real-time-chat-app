# Real-Time Chat Application

## Project Overview

This project is a Real-Time Chat Application developed using React.js, Node.js, Express.js, MySQL, JWT Authentication, bcrypt, and Socket.io.

The application allows users to register, log in securely, communicate through private messaging, view online users, see typing indicators, and load previous chat history stored in MySQL.

---

## Features

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt
* Socket Authentication
* Real-Time Private Messaging
* Online Users Tracking
* Typing Indicator
* Chat History Retrieval
* Message Persistence using MySQL
* Auto Scroll to Latest Message
* Logout Functionality

---

## Technologies Used

### Frontend

* React.js
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* MySQL

### Security

* JWT (JSON Web Token)
* bcrypt

---

## Project Structure

chat-app/

├── src/

│ ├── App.js

│ ├── Login.js

│ └── Register.js

├── routes/

│ └── auth.js

├── server.js

├── db.js

├── package.json

├── .gitignore

└── README.md

---

## Database Tables

### Users Table

* id
* username
* password

### Messages Table

* id
* sender_id
* receiver_id
* message
* created_at

---

## Installation

### Clone Repository

git clone <repository-url>

### Install Backend Dependencies

npm install

### Install Frontend Dependencies

npm install

### Start Backend

node server.js

### Start Frontend

npm start

---

## Future Enhancements

* Group Chat
* File Sharing
* Profile Pictures
* Read Receipts
* Dark Mode
* Voice and Video Calling

---

## Author

Kiran Kumar K L

Information Science and Engineering

Real-Time Chat Application Project
