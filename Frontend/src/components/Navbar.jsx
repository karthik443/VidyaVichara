import React from "react";

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    // Remove token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // send user back to login/register page
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#4caf50",
        color: "#fff",
      }}
    >
      <h3>VidyaVichara</h3>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              background: "#fff",
              color: "#4caf50",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
