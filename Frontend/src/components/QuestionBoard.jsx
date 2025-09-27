import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // keep same socket endpoint

function QuestionBoard({ user }) {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent");
  const [slideshowMode, setSlideshowMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // fetch questions
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/questions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();

    socket.on("newQuestion", (q) => setQuestions((prev) => [q, ...prev]));
    socket.on("updateQuestion", (updated) =>
      setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)))
    );
    socket.on("deleteQuestion", (deleted) =>
      setQuestions((prev) => prev.filter((q) => q._id !== deleted._id))
    );
    socket.on("clearQuestions", () => setQuestions([]));

    return () => socket.off(); // cleanup all listeners
  }, []);

  // student submits a question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "student") return;
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/questions",
        { text, author: user.name },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setText("");
    } catch (err) {
      console.error("Error submitting question:", err);
    }
  };

  // teacher updates status or answer
  const updateStatus = async (id, status = null, answer = null) => {
    if (user.role !== "teacher") return;
    try {
      const token = localStorage.getItem("token");
      let updateQuestion = { id };
      if (status) updateQuestion.status = status;
      if (answer !== null) updateQuestion.answer = answer;
      await axios.post(`http://localhost:5000/questions/update`, updateQuestion, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // teacher deletes question
  const deleteQuestion = async (id) => {
    if (user.role !== "teacher") return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/questions/delete",
        { _id: id },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      if (slideshowMode && currentIndex >= questions.length - 1)
        setCurrentIndex(Math.max(0, currentIndex - 1));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  // local handlers for adding answers (UI + triggers backend update)
  const handleAddAnswerClick = (id) => {
    setQuestions((prev) => prev.map((q) => (q._id === id ? { ...q, addingAnswer: true } : q)));
  };
  const handleAnswerChange = (id, value) => {
    setQuestions((prev) => prev.map((q) => (q._id === id ? { ...q, tempAnswer: value } : q)));
  };
  const handleAnswerSubmit = (id) => {
    const question = questions.find((q) => q._id === id);
    const answerText = (question && question.tempAnswer && question.tempAnswer.trim()) || "Not Answerd";

    // update local state (so UI changes immediately)
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id
          ? { ...q, answer: answerText, addingAnswer: false, tempAnswer: "", status: "answered" }
          : q
      )
    );

    // send to backend
    updateStatus(id, "answered", answerText);
  };

  // Helper: sort by createdAt desc safely
  const sortDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.createdAt || b.created_at || b.timestamp) - new Date(a.createdAt || a.created_at || a.timestamp));

  // Get questions to show in each column based on filter
  const getColumnQuestions = (statusKey) => {
    if (filter === "recent") {
      const recent = sortDesc(questions).slice(0, 5);
      return recent.filter((q) => q.status === statusKey);
    }
    if (["unanswered", "answered", "important"].includes(filter)) {
      if (filter !== statusKey) return [];
      return sortDesc(questions.filter((q) => q.status === statusKey));
    }
    // default: show all for the column
    return sortDesc(questions.filter((q) => q.status === statusKey));
  };

  // format timestamp
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // column definitions (green/red/yellow like your picture)
  const columns = [
    { key: "unanswered", title: "Unanswered", color: "#FFF7C0" }, // yellow
    { key: "important", title: "Important", color: "#FFDDE0" }, // red-ish
    { key: "answered", title: "Answered", color: "#E9F9EA" }, // green-ish
  ];

  // styles (inline for portability)
  const styles = {
    page: {
      minHeight: "100vh",
      padding: "28px",
      background: "linear-gradient(135deg,#f7eafc 0%,#fcefee 40%, #f8fbff 100%)",
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    },
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
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>VidyaVichar — Question Board</div>
          <div style={{ color: "#666", marginTop: 4 }}>Live Q&A for your lecture</div>
        </div>

        <div style={styles.controls}>
          {/* Student ask box (only show full input to students) */}
          {user.role === "student" && (
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

          {/* Filter select */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e0e0e0" }}
          >
            <option value="recent">Recent</option>
            <option value="unanswered">Unanswered</option>
            <option value="answered">Answered</option>
            <option value="important">Important</option>
          </select>
        </div>
      </div>

      {/* Board columns */}
      <div style={styles.board}>
        {columns.map((col) => {
          const items = getColumnQuestions(col.key);
          return (
            <div key={col.key} style={{ ...styles.column, background: col.color }}>
              <div style={styles.columnHeader}>
                <strong style={{ textTransform: "capitalize" }}>{col.title}</strong>
                <span style={styles.small}>{items.length}</span>
              </div>

              {/* Cards */}
              {items.length === 0 && <div style={{ color: "#666", fontSize: 13 }}>No questions</div>}
              {items.map((q) => (
                <div key={q._id} style={{ ...styles.card, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{q.text}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={styles.small}>
                          <span>Author: {q.author || "Anonymous"}</span>
                          {" • "}
                          <span>{formatDate(q.createdAt || q.created_at || q.timestamp)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ fontSize: 12, color: "#999", padding: "4px 8px", borderRadius: 8, background: "#f5f5f5" }}>
                            {q.status}
                          </div>
                        </div>
                      </div>

                      {/* display answer */}
                      {q.answer && q.answer !== "Not Answerd" && (
                        <div style={{ marginTop: 10, color: "#116530", background: "#ecf8ee", padding: 8, borderRadius: 8 }}>
                          <strong>Answer:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher controls */}
                  {user.role === "teacher" && (
                    <>
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
                      </div>

                      {/* Add Answer UI */}
                      {q.answer === "Not Answerd" && (
                        <div style={{ marginTop: 8 }}>
                          {!q.addingAnswer ? (
                            <button onClick={() => handleAddAnswerClick(q._id)} style={{ ...styles.pillBtn, background: "#6366f1", color: "#fff" }}>
                              Add Answer
                            </button>
                          ) : (
                            <div style={{ marginTop: 8 }}>
                              <textarea
                                rows={3}
                                value={q.tempAnswer || ""}
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                placeholder="Type your answer here..."
                                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e0e0e0" }}
                              />
                              <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                                <button onClick={() => handleAnswerSubmit(q._id)} style={{ ...styles.pillBtn, background: "#10b981", color: "#fff" }}>
                                  Submit Answer
                                </button>
                                <button
                                  onClick={() =>
                                    setQuestions((prev) => prev.map((x) => (x._id === q._id ? { ...x, addingAnswer: false, tempAnswer: "" } : x)))
                                  }
                                  style={{ ...styles.pillBtn, background: "#9ca3af", color: "#fff" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
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
