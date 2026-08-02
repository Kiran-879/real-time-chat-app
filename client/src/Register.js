import React, { useState } from "react";
import axios from "axios";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleRegister = async () => {

    try {

      await axios.post(

        "http://localhost:5000/api/auth/register",

        {
          username,
          password
        }

      );

      alert("User Registered");

    } catch (err) {

      console.log(err);

      alert("Register Failed");

    }

  };


  return (

    <div style={{ padding: "20px" }}>

      <h2>Register</h2>

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

      <button onClick={handleRegister}>
        Register
      </button>

    </div>

  );

}

export default Register;