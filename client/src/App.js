import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Login from "./Login";
import Register from "./Register";


// 🔥 SOCKET CONNECTION
const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});


function App() {

  // 🔥 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );


  // 🔥 STATES
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔥 CURRENT USER
  const token = localStorage.getItem("token");

let senderId = null;
let senderUsername = "";

if (token) {

  const decoded = jwtDecode(token);

  senderId = decoded.id;
  senderUsername = decoded.username;

}
  // 🔥 SHOW LOGIN/REGISTER PAGE
  
  // 🔥 SOCKET EVENTS
  useEffect(() => {

    // 🔥 RECEIVE CHAT HISTORY
    socket.on("chatHistory", (data) => {

      setMessages(data);

    });
    

    // 🔥 CONNECTION SUCCESS
    socket.on("connect", () => {

  console.log("✅ Connected to server");
  console.log("Socket ID:", socket.id);

});

    // 🔥 CONNECTION ERROR
    socket.on("connect_error", (err) => {

      console.log("❌ Socket Error:", err.message);

    });

    // 🔥 RECEIVE NEW MESSAGE
    socket.on("receiveMessage", (data) => {

      setMessages((prev) => [...prev, data]);

    });

    // 🔥 RECEIVE ONLINE USERS
    socket.on("onlineUsers", (users) => {

      setOnlineUsers(users);

    });

    // 🔥 TYPING INDICATOR
    socket.on("typing", (data) => {

  console.log("Typing received:", data);

  setTypingUser(data.sender);

  setTimeout(() => {

    setTypingUser("");

  }, 3000);

});

    // 🔥 CLEANUP LISTENERS
    return () => {

      socket.off("chatHistory");
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("typing");

    };

  }, []);
  useEffect(() => {

  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });

}, [messages]);
if (!isLoggedIn) {

    return (

      <div>

        <Register />

        <hr />

        <Login setIsLoggedIn={setIsLoggedIn} />

      </div>

    );

  }
  // 🔥 SEND PRIVATE MESSAGE
  const sendMessage = () => {

    if (!selectedUser) {

      alert("Select a user first");
      return;

    }

    if (message.trim() === "") return;

    socket.emit("privateMessage", {

      receiverId: selectedUser,
      message

    });

    setMessage("");

  };

  return (

    <div style={{ padding: "20px" }}>
    <button
  onClick={() => {

    localStorage.removeItem("token");

    socket.disconnect();

    window.location.reload();

  }}

  style={{
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px"
  }}
>
  Logout
</button>

    <div
  style={{
    display: "flex",
    height: "90vh",
    border: "1px solid #ccc"
  }}
>

  {/* LEFT SIDEBAR */}
  <div
    style={{
      width: "25%",
      borderRight: "1px solid #ccc",
      padding: "10px"
    }}
  >

    <h3>Online Users</h3>

    <p>
      Logged in as: <strong>{senderUsername}</strong>
    </p>

    {Object.entries(onlineUsers).map(([userId, user]) => (

  Number(userId) !== senderId && (

    <button
      key={userId}

      onClick={() => {

        setSelectedUser(Number(userId));

        socket.emit("loadMessages", {
          senderId,
          receiverId: Number(userId)
        });

      }}

      style={{
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor:
    Number(userId) === selectedUser
      ? "#25D366"
      : "#f1f1f1",
  color:
    Number(userId) === selectedUser
      ? "white"
      : "black"
}}
    >

      <span>

  🟢 {user.username}

</span>

    </button>

  )

))}

  </div>
  <div style={{ paddingLeft: "10px" }}>

  {typingUser && (
    <p>{typingUser} is typing...</p>
  )}

</div>



  {/* CHAT AREA */}
  <div
    style={{
      width: "75%",
      display: "flex",
      flexDirection: "column"
    }}
  >

    {/* CHAT HEADER */}
    <div
      style={{
        borderBottom: "1px solid #ccc",
        padding: "10px"
      }}
    >

      {selectedUser ? (

       <h3>

  {selectedUser
    ? `Chatting with ${
        onlineUsers[selectedUser]?.username
      }`
    : "Select a User"}

</h3>

      ) : (

        <h3>Select a User</h3>

      )}

    </div>



    {/* MESSAGES */}
    <div
  style={{
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    backgroundColor: "#ECE5DD"
  }}
>

      {messages.map((msg, index) => (

       <p key={index}>

 <strong>
  {msg.sender || msg.username}
</strong>

  : {msg.message}

  <span
    style={{
      marginLeft: "10px",
      color: "gray",
      fontSize: "12px"
    }}
  >

    {msg.created_at &&
      new Date(msg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

  </span>

</p>

      ))}

    </div><div
  style={{
    flex: 1,
    overflowY: "auto",
    padding: "10px"
  }}
>

  {messages.map((msg, index) => (

  <div
    key={index}
    style={{
      display: "flex",
      justifyContent:
        msg.sender_id === senderId
          ? "flex-end"
          : "flex-start",
      marginBottom: "10px"
    }}
  >

    <div
      style={{
        backgroundColor:
          msg.sender_id === senderId
            ? "#DCF8C6"
            : "#FFFFFF",

        padding: "10px",
        borderRadius: "12px",
        maxWidth: "60%",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)"
      }}
    >

      <strong>

        {msg.sender || msg.username}

      </strong>

      <br />

      {msg.message}

      <br />

      <span
        style={{
          fontSize: "11px",
          color: "gray"
        }}
      >

        {msg.created_at &&
          new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }

      </span>

    </div>

  </div>

))}
  {/* Auto Scroll Target */}
  <div ref={messagesEndRef}></div>

</div>



    {/* TYPING */}
    <div style={{ paddingLeft: "10px" }}>

      {typingUser && (
       <p
  style={{
    color: "#25D366",
    fontStyle: "italic",
    marginLeft: "10px"
  }}
>

  {typingUser && `${typingUser} is typing...`}

</p>
      )}

    </div>



    {/* INPUT AREA */}
    <div
      style={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ccc"
      }}
    >

     <input
     style={{
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
}}
  value={message}
 onChange={(e) => {

    setMessage(e.target.value);

    if (!selectedUser) {
        return;
    }

    socket.emit("typing", {
        receiverId: selectedUser
    });

}}
  placeholder="Type message..."
/>
<button
  onClick={sendMessage}
  style={{
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Send
</button>

    </div>

  </div>

</div>
           
      

    </div>

  );

}
export default App;