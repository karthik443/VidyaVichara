import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function QuestionBoard({ user, lecture, onLeave }) {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent");

  const lectureId = lecture?._id;
    const isLectureLive = lecture?.isLive === "Live";
  // fetch questions for this lecture
  const fetchQuestions = async () => {
    if (!lectureId) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/questions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { lectureId },
      });
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();

    socket.on("newQuestion", (q) => {
      if (q.lectureId === lectureId) setQuestions((prev) => [q, ...prev]);
    });
    socket.on("updateQuestion", (updated) => {
      if (updated.lectureId === lectureId)
        setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
    });
    socket.on("deleteQuestion", (deleted) => {
      if (deleted.lectureId === lectureId)
        setQuestions((prev) => prev.filter((q) => q._id !== deleted._id));
    });
    socket.on("clearQuestions", () => setQuestions([]));

    return () => socket.off();
  }, [lectureId]);

  // student asks question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "student") return;
    if (!text.trim()) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/questions",
        { text, author: user.name, lectureId },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  // teacher updates question status or answer
  const updateStatus = async (id, status = null, answer = null) => {
    if (user.role !== "teacher") return;
    try {
      const token = sessionStorage.getItem("token");
      let updateQuestion = { id };
      if (status) updateQuestion.status = status;
      if (answer !== null) updateQuestion.answer = answer;
      await axios.post(`http://localhost:5000/questions/update`, updateQuestion, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async (id) => {
    if (user.role !== "teacher") return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/questions/delete",
        { _id: id },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: "unanswered", title: "Unanswered", color: "#FFF7C0" },
    { key: "important", title: "Important", color: "#FFDDE0" },
    { key: "answered", title: "Answered", color: "#E9F9EA" },
  ];

  const sortDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.createdAt || b.created_at || b.timestamp) - new Date(a.createdAt || a.created_at || a.timestamp));

  const getColumnQuestions = (statusKey) => {
    if (filter === "recent") {
      const recent = sortDesc(questions).slice(0, 5);
      return recent.filter((q) => q.status === statusKey);
    }
    if (["unanswered", "answered", "important"].includes(filter)) {
      if (filter !== statusKey) return [];
      return sortDesc(questions.filter((q) => q.status === statusKey));
    }
    return sortDesc(questions.filter((q) => q.status === statusKey));
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const styles = {
    page: { minHeight: "100vh", padding: "28px", fontFamily: '"Inter", system-ui', background: "#f8f8f8" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    title: { fontSize: 22, fontWeight: 700, color: "#222" },
    controls: { display: "flex", gap: 10, alignItems: "center" },
    input: { padding: "8px 10px", width: 420, borderRadius: 8, border: "1px solid #e0e0e0" },
    askButton: { padding: "8px 12px", borderRadius: 8, background: "#6C63FF", color: "#fff", border: "none", cursor: "pointer" },
    board: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
    column: { borderRadius: 14, padding: 14, minHeight: 300, boxShadow: "0 6px 18px rgba(16,24,40,0.06)" },
    columnHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    card: { padding: 12, borderRadius: 10, marginBottom: 12, boxShadow: "0 4px 8px rgba(16,24,40,0.06)" },
    small: { color: "#666", fontSize: 12 },
    pillBtn: { padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12 },
    teacherActions: { display: "flex", gap: 8, marginTop: 8 },
    leaveBtn: { marginBottom: 20, padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  };
console.log(isLectureLive,"Islecturelive")
  return (
    <div style={styles.page}>
      <button style={styles.leaveBtn} onClick={onLeave}>← Leave Lecture</button>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>{lecture?.title} — Question Board</div>
          <div style={{ color: "#666", marginTop: 4 }}>Live Q&A for your lecture</div>
        </div>

        <div style={styles.controls}>


{user.role === "student" && isLectureLive && (
  <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
    <input
      style={styles.input}
      placeholder="Type your question..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button style={styles.askButton} type="submit">
      Ask
    </button>
  </form>
)}

{!isLectureLive && (
  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
    Lecture is not live. Your questions will be added and visible to teacher.
  </div>
)}

          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e0e0e0" }}>
            <option value="recent">Recent</option>
            <option value="unanswered">Unanswered</option>
            <option value="answered">Answered</option>
            <option value="important">Important</option>
          </select>
        </div>
      </div>

      <div style={styles.board}>
        {columns.map((col) => {
          const items = getColumnQuestions(col.key);
          return (
            <div key={col.key} style={{ ...styles.column, background: col.color }}>
              <div style={styles.columnHeader}>
                <strong style={{ textTransform: "capitalize" }}>{col.title}</strong>
                <span style={styles.small}>{items.length}</span>
              </div>

              {items.length === 0 && <div style={{ color: "#666", fontSize: 13 }}>No questions</div>}

              {items.map((q) => (
                <div key={q._id} style={{ ...styles.card, background: "#fff" }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>{q.text}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666" }}>
                    <span>Author: {q.author || "Anonymous"} • {formatDate(q.createdAt || q.created_at || q.timestamp)}</span>
                    <span>{q.status}</span>
                  </div>

                  {q.answer && q.answer !== "Not Answerd" && (
                    <div style={{ marginTop: 10, color: "#116530", background: "#ecf8ee", padding: 8, borderRadius: 8 }}>
                      <strong>Answer:</strong> {q.answer}
                    </div>
                  )}

                  {user.role === "teacher" && (
  <div style={styles.teacherActions}>
    <button
      onClick={() => updateStatus(q._id, "answered")}
      style={{ ...styles.pillBtn, background: "#0ea5a4", color: "#fff" }}
    >
      Mark Answered
    </button>
    <button
      onClick={() => updateStatus(q._id, "important")}
      style={{ ...styles.pillBtn, background: "#f43f5e", color: "#fff" }}
    >
      Important
    </button>
    <button
      onClick={() => deleteQuestion(q._id)}
      style={{ ...styles.pillBtn, background: "#ef4444", color: "#fff" }}
    >
      Delete
    </button>

    {/* Inline answer input */}
    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
      <input
        type="text"
        placeholder="Type answer..."
        value={q.tempAnswer || ""}
        onChange={(e) => {
          setQuestions((prev) =>
            prev.map((item) =>
              item._id === q._id ? { ...item, tempAnswer: e.target.value } : item
            )
          );
        }}
        style={{ flex: 1, padding: 4, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <button
        onClick={() => {
          if (!q.tempAnswer?.trim()) return;
          updateStatus(q._id, "answered", q.tempAnswer);
          setQuestions((prev) =>
            prev.map((item) =>
              item._id === q._id ? { ...item, tempAnswer: "" } : item
            )
          );
        }}
        style={{ ...styles.pillBtn, background: "#22c55e", color: "#fff" }}
      >
        Answer
      </button>
    </div>
  </div>
)}

                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionBoard;
