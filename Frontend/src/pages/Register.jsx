import React, { useState } from "react";
import axios from "axios";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        name,
        email,
        password,
        role,
      });

      // Save token and user info
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // Same styles as before but removed footer
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    contentWrapper: {
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center'
    },
    header: {
      marginBottom: '48px'
    },
    title: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 16px 0',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: '20px',
      color: '#6b7280',
      margin: '0'
    },
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      padding: '40px',
      border: '2px solid #8b5cf6'
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    cardIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '24px',
      backgroundColor: '#f3e8ff',
      color: '#8b5cf6'
    },
    cardTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 8px 0'
    },
    cardDescription: {
      color: '#6b7280',
      margin: '0'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      outline: 'none',
      backgroundColor: '#ffffff'
    },
    button: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#8b5cf6',
      color: '#ffffff'
    },
    errorMessage: {
      marginTop: '20px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Join VidyaVichara</h1>
          <p style={styles.subtitle}>Create your account to get started</p>
        </div>

        {/* Registration Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              ✨
            </div>
            <h2 style={styles.cardTitle}>Create Account</h2>
            <p style={styles.cardDescription}>Fill in your details to register</p>
          </div>

          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="student">Register as Student</option>
              <option value="teacher">Register as Teacher</option>
            </select>
            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
            >
              Create Account
            </button>
          </form>

          {error && (
            <p style={styles.errorMessage}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
