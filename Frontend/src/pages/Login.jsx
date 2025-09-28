import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("teacher"); // teacher or student

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const primary = "#8b5cf6";   // base color
  const primaryHover = "#7c3aed"; 
  const primaryActive = "#6d28d9"; 

  const styles = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: "100vh",
      width: "100vw",
      background:
        "linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #eff6ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    contentWrapper: {
      width: "100%",
      maxWidth: "1000px",
      textAlign: "center",
    },
    header: {
      marginBottom: "48px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "700",
      color: "#1f2937",
      margin: "0 0 16px 0",
      lineHeight: "1.2",
    },
    subtitle: {
      fontSize: "20px",
      color: "#6b7280",
      margin: "0",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
      gap: "32px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    card: {
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      padding: "32px",
      transition: "all 0.3s ease",
      border: "2px solid #e5e7eb",
    },
    cardActive: {
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
      borderColor: primary,
    },
    cardHeader: {
      textAlign: "center",
      marginBottom: "32px",
    },
    cardIcon: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      fontSize: "24px",
      backgroundColor: "#f3e8ff",
      color: primary,
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1f2937",
      margin: "0 0 8px 0",
    },
    cardDescription: {
      color: "#6b7280",
      margin: "0",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      outline: "none",
      backgroundColor: primary,
      color: "#fff",
    },
    errorMessage: {
      marginTop: "24px",
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#b91c1c",
      padding: "16px",
      borderRadius: "8px",
      textAlign: "center",
      maxWidth: "400px",
      margin: "24px auto 0",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>VidyaVichara</h1>
          <p style={styles.subtitle}>
            Interactive Learning Through Sticky Notes
          </p>
        </div>

        {/* Cards Grid */}
        <div style={styles.cardsGrid}>
          {/* Teacher Card */}
          <div
            style={{
              ...styles.card,
              ...(userType === "teacher" ? styles.cardActive : {}),
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>📚</div>
              <h3 style={styles.cardTitle}>Teacher Login</h3>
              <p style={styles.cardDescription}>
                Create and manage your lecture boards
              </p>
            </div>

            {userType === "teacher" ? (
              <form onSubmit={handleLogin} style={styles.form}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  style={styles.input}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={styles.input}
                />
                <button
                  type="submit"
                  style={styles.button}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = primary)
                  }
                  onMouseDown={(e) =>
                    (e.target.style.backgroundColor = primaryActive)
                  }
                  onMouseUp={(e) =>
                    (e.target.style.backgroundColor = primaryHover)
                  }
                >
                  Continue as Teacher
                </button>
              </form>
            ) : (
              <button
                onClick={() => setUserType("teacher")}
                style={styles.button}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = primary)
                }
                onMouseDown={(e) =>
                  (e.target.style.backgroundColor = primaryActive)
                }
                onMouseUp={(e) =>
                  (e.target.style.backgroundColor = primaryHover)
                }
              >
                Continue as Teacher
              </button>
            )}
          </div>

          {/* Student Card */}
          <div
            style={{
              ...styles.card,
              ...(userType === "student" ? styles.cardActive : {}),
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Student Login</h3>
              <p style={styles.cardDescription}>
                Login with your credentials
              </p>
            </div>

            {userType === "student" ? (
              <form onSubmit={handleLogin} style={styles.form}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  style={styles.input}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={styles.input}
                />
                <button
                  type="submit"
                  style={styles.button}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = primary)
                  }
                  onMouseDown={(e) =>
                    (e.target.style.backgroundColor = primaryActive)
                  }
                  onMouseUp={(e) =>
                    (e.target.style.backgroundColor = primaryHover)
                  }
                >
                  Login as Student
                </button>
              </form>
            ) : (
              <button
                onClick={() => setUserType("student")}
                style={styles.button}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = primary)
                }
                onMouseDown={(e) =>
                  (e.target.style.backgroundColor = primaryActive)
                }
                onMouseUp={(e) =>
                  (e.target.style.backgroundColor = primaryHover)
                }
              >
                Login as Student
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
