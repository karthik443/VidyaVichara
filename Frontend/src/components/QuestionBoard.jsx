import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function QuestionBoard({ user, lecture, onLeave }) {
  // Slideshow state
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent");
  const [currentLecture, setCurrentLecture] = useState(lecture);
  

  const lectureId = lecture?._id;
useEffect(() => {
  // ...existing question listeners...

  socket.on("updateLecture", (updatedLecture) => {
    if (updatedLecture._id === lectureId) {
      setCurrentLecture(updatedLecture);
    }
  });

  return () => socket.off();
}, [lectureId]);

// Use currentLecture instead of lecture
const isLectureLive = currentLecture?.isLive === "Live";
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

  const updateStatus = async (id, status = null, answer = null, file = null) => {
    if (user.role !== "teacher") return;
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("id", id);
      if (status) formData.append("status", status);
      if (answer) formData.append("answer", answer);
      if (file) formData.append("resources", file);

      await axios.post("http://localhost:5000/questions/update", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
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
    [...arr].sort(
      (a, b) =>
        new Date(b.createdAt || b.created_at || b.timestamp) -
        new Date(a.createdAt || a.created_at || a.timestamp)
    );

  // Get filtered questions for slideshow
  const getFilteredQuestions = () => {
    if (filter === "recent") {
      return sortDesc(questions).slice(0, 5);
    }
    if (["unanswered", "answered", "important"].includes(filter)) {
      return sortDesc(questions.filter((q) => q.status === filter));
    }
    return sortDesc(questions);
  };

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
  page: {
    minHeight: "100vh",
    padding: "28px",
    fontFamily: '"Inter", system-ui',
    background: "linear-gradient(135deg, #e6d4ff, #ffffff)", // corrected
  },
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
              <button style={styles.askButton} type="submit">Ask</button>
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
          {user.role === "teacher" && (
            <button
              style={{ marginLeft: 12, padding: "8px 16px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
              onClick={() => { setSlideshowActive(true); setSlideIndex(0); }}
            >
              Slideshow Mode
            </button>
          )}
        </div>
      </div>

      {/* Slideshow UI */}
      {slideshowActive && user.role === "teacher" && (
        (() => {
          const filteredQuestions = getFilteredQuestions();
          if (filteredQuestions.length === 0) {
            return (
              <div style={{ textAlign: "center", margin: "32px auto" }}>
                <div className="card" style={{ display: "inline-block", minWidth: 400 }}>
                  <h3>No questions for this filter.</h3>
                  <button style={{ marginTop: 16 }} onClick={() => setSlideshowActive(false)}>Exit Slideshow</button>
                </div>
              </div>
            );
          }
          const q = filteredQuestions[slideIndex];
          return (
            <div style={{ textAlign: "center", margin: "32px auto" }}>
              <div className="card" style={{ display: "inline-block", minWidth: 400, padding: 24 }}>
                <h3>{q.text}</h3>
                <div style={{ margin: "12px 0", fontSize: 14, color: "#666" }}>
                  Author: {q.author || "Anonymous"} • {formatDate(q.createdAt || q.created_at || q.timestamp)}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 600 }}>Status:</span> {q.status}
                </div>
                {q.answer && q.answer !== "Not Answerd" && (
                  <div style={{ marginTop: 10, color: "#116530", background: "#ecf8ee", padding: 8, borderRadius: 8 }}>
                    <strong>Answer:</strong> {q.answer}
                  </div>
                )}
                {q.resources && q.resources.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Resources:</strong>
                    <ul style={{ marginTop: 4 }}>
                      {q.resources.map((r, idx) => (
                        <li key={idx}>
                          <a href={`http://localhost:5000${r.url}`} target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5a4", textDecoration: "underline" }}>
                            {r.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Mark/Answer UI */}
                <div style={{ marginTop: 16 }}>
                  <input
                    type="text"
                    placeholder="Type answer..."
                    value={q.tempAnswer || ""}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((item) =>
                          item._id === q._id ? { ...item, tempAnswer: e.target.value } : item
                        )
                      )
                    }
                    style={{ width: "60%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                  />
                  <input
                    type="file"
                    style={{ marginLeft: 8 }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setQuestions((prev) =>
                        prev.map((item) =>
                          item._id === q._id ? { ...item, tempFile: file } : item
                        )
                      );
                    }}
                  />
                  <button
                    onClick={() => updateStatus(q._id, "answered", q.tempAnswer, q.tempFile)}
                    style={{ background: "#22c55e", color: "#fff", padding: "6px 12px", borderRadius: 6, marginLeft: 8 }}
                  >
                    Answer
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                  <button onClick={() => updateStatus(q._id, "answered")} style={{ ...styles.pillBtn, background: "#0ea5a4", color: "#fff" }}>Answered</button>
                  <button onClick={() => updateStatus(q._id, "important")} style={{ ...styles.pillBtn, background: "#f43f5e", color: "#fff" }}>Important</button>
                  <button onClick={() => updateStatus(q._id, "unanswered")} style={{ ...styles.pillBtn, background: "#e0e0e0", color: "#333" }}>Unanswered</button>
                  <button onClick={() => deleteQuestion(q._id)} style={{ ...styles.pillBtn, background: "#ef4444", color: "#fff" }}>Delete</button>
                </div>
                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={() => setSlideIndex(i => Math.max(i - 1, 0))}
                    disabled={slideIndex === 0}
                    style={{ marginRight: 12 }}
                  >
                    Prev
                  </button>
                  <span style={{ margin: "0 16px" }}>{slideIndex + 1} / {filteredQuestions.length}</span>
                  <button
                    onClick={() => setSlideIndex(i => Math.min(i + 1, filteredQuestions.length - 1))}
                    disabled={slideIndex === filteredQuestions.length - 1}
                    style={{ marginLeft: 12 }}
                  >
                    Next
                  </button>
                </div>
                <button style={{ marginTop: 16 }} onClick={() => setSlideshowActive(false)}>Exit Slideshow</button>
              </div>
            </div>
          );
        })()
      )}

      {/* Normal board UI hidden in slideshow mode */}
      {!slideshowActive && (
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

                    {q.resources && q.resources.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Resources:</strong>
                        <ul style={{ marginTop: 4 }}>
                          {q.resources.map((r, idx) => (
                            <li key={idx}>
                              <a href={`http://localhost:5000${r.url}`} target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5a4", textDecoration: "underline" }}>
                                {r.filename}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {user.role === "teacher" && (
                      <div style={{ marginTop: 8 }}>
                        {/* Answer + File */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                          <input
                            type="text"
                            placeholder="Type answer..."
                            value={q.tempAnswer || ""}
                            onChange={(e) =>
                              setQuestions((prev) =>
                                prev.map((item) =>
                                  item._id === q._id ? { ...item, tempAnswer: e.target.value } : item
                                )
                              )
                            }
                            style={{ flex: 1, padding: 4, borderRadius: 6, border: "1px solid #ccc" }}
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setQuestions((prev) =>
                                prev.map((item) =>
                                  item._id === q._id ? { ...item, tempFile: file } : item
                                )
                              );
                            }}
                          />
                          <button
                            onClick={() => updateStatus(q._id, "answered", q.tempAnswer, q.tempFile)}
                            style={{ background: "#22c55e", color: "#fff", padding: "6px 12px", borderRadius: 6 }}
                          >
                            Answer
                          </button>
                        </div>

                        {/* Status Buttons */}
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => updateStatus(q._id, "answered")} style={{ ...styles.pillBtn, background: "#0ea5a4", color: "#fff" }}>Answered</button>
                          <button onClick={() => updateStatus(q._id, "important")} style={{ ...styles.pillBtn, background: "#f43f5e", color: "#fff" }}>Important</button>
                          <button onClick={() => updateStatus(q._id, "unanswered")} style={{ ...styles.pillBtn, background: "#e0e0e0", color: "#333" }}>Unanswered</button>
                          <button onClick={() => deleteQuestion(q._id)} style={{ ...styles.pillBtn, background: "#ef4444", color: "#fff" }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QuestionBoard;
