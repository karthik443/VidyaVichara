// import React from "react";

// function Navbar({ user, setUser }) {
//   const handleLogout = () => {
//     // Remove token and user info from sessionStorage
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user");
//     setUser(null); // send user back to login/register page
//   };

//   return (
//     <nav
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "10px 20px",
//         background: "#4caf50",
//         color: "#fff",
//       }}
//     >
//       <h3>VidyaVichara</h3>
//       {user && (
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <span>Welcome, {user.name}</span>
//           <button
//             onClick={handleLogout}
//             style={{
//               padding: "6px 12px",
//               background: "#fff",
//               color: "#4caf50",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;



import React from "react";

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#1e1e1e", // dark navbar background to make gradient text pop
        color: "#fff",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "700",
          background: "linear-gradient(90deg, #a78bfa, #6c63ff, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        VidyaVichara
      </h3>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              background: "#fff",
              color: "#4a90e2",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#4a90e2";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#4a90e2";
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
