import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuestionBoard from "./components/QuestionBoard";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <div>
      {/* Navbar is always visible */}
      <Navbar user={user} setUser={setUser} />

      {!user ? (
        showRegister ? (
          <>
            <Register setUser={setUser} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Already have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setShowRegister(false)}
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setShowRegister(true)}
              >
                Register
              </span>
            </p>
          </>
        )
      ) : (
        <QuestionBoard user={user} />
      )}
    </div>
  );
}

export default App;
