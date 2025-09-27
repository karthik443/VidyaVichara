import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import LectureBoard from "./components/LectureBoard";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // Navigation link styles
  const linkStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '16px 24px',
    borderRadius: '50px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#8b5cf6',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'underline',
    padding: '4px'
  };

  return (
    <div>
      {!user ? (
        <>
          {showRegister ? (
            <>
              <Register setUser={setUser} />
              <div style={linkStyle}>
                Already have an account?{" "}
                <button
                  style={buttonStyle}
                  onClick={() => setShowRegister(false)}
                  onMouseEnter={(e) => e.target.style.color = '#7c3aed'}
                  onMouseLeave={(e) => e.target.style.color = '#8b5cf6'}
                >
                  Sign in here
                </button>
              </div>
            </>
          ) : (
            <>
              <Login setUser={setUser} />
              <div style={linkStyle}>
                Don't have an account?{" "}
                <button
                  style={buttonStyle}
                  onClick={() => setShowRegister(true)}
                  onMouseEnter={(e) => e.target.style.color = '#7c3aed'}
                  onMouseLeave={(e) => e.target.style.color = '#8b5cf6'}
                >
                  Create one here
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Navbar user={user} setUser={setUser} />
          <LectureBoard user={user} />
        </>
      )}
    </div>
  );
}

export default App;
