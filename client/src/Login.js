import React, { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {

    try {

      const res = await axios.post(

        "http://localhost:5000/api/auth/login",

        {
          username,
          password
        }

      );

      // Store JWT token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      setIsLoggedIn(true);

      window.location.reload();

    } catch (err) {

      console.log(err);

      alert("Login Failed");

    }

  };


  return (

    <div style={{ padding: "20px" }}>

      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>

  );

}

export default Login;