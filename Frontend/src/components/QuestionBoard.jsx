import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function QuestionBoard() {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent");
  const role = localStorage.getItem("role") || "student"; // ✅ get role from login

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
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

    return () => socket.off();
  }, []);

  // Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post("http://localhost:5000/questions", {
        text,
        author: "Anonymous",
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/questions/${id}`, { status });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.post("http://localhost:5000/questions/delete", { _id: id });
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete("http://localhost:5000/questions");
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredQuestions = () => {
    if (filter === "recent") {
      return [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    }
    return questions.filter((q) => q.status === filter);
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Role: {role}</h2>

      {role === "student" && (
        <form onSubmit={handleSubmit}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your question"
          />
          <button type="submit">Ask</button>
        </form>
      )}

      <div style={{ margin: "10px 0" }}>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="recent">Recent</option>
          <option value="unanswered">Unanswered</option>
          <option value="answered">Answered</option>
          <option value="important">Important</option>
        </select>
      </div>

      {role === "teacher" && (
        <button onClick={clearAll}>Clear All Questions</button>
      )}

      <div>
        {filteredQuestions.map((q) => (
          <div key={q._id} style={{ border: "1px solid #ddd", margin: "10px 0", padding: "10px" }}>
            <p>{q.text}</p>
            <small>Status: {q.status}</small>

            {role === "teacher" && (
              <div>
                <button onClick={() => updateStatus(q._id, "answered")}>Answered</button>
                <button onClick={() => updateStatus(q._id, "important")}>Important</button>
                <button onClick={() => deleteQuestion(q._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionBoard;
