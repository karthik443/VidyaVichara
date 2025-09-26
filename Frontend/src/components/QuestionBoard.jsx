// src/components/QuestionBoard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // connect to backend socket

function QuestionBoard() {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");

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

    // Listen for new questions
    socket.on("newQuestion", (q) => {
      setQuestions((prev) => [q, ...prev]);
    });

    // Listen for updates
    socket.on("updateQuestion", (updated) => {
      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updated : q))
      );
    });

    // Listen for clear
    socket.on("clearQuestions", () => setQuestions([]));

    return () => {
      socket.off("newQuestion");
      socket.off("updateQuestion");
      socket.off("clearQuestions");
    };
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

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/questions/${id}`, { status });
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all questions
  const clearAll = async () => {
    try {
      await axios.delete("http://localhost:5000/questions");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Ask</button>
      </form>

      <button onClick={clearAll}>Clear All Questions</button>

      <div>
        {questions.map((q) => (
          <div
            key={q._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <p>{q.text}</p>
            <small>Status: {q.status}</small>
            <div>
              <button onClick={() => updateStatus(q._id, "answered")}>
                Answered
              </button>
              <button onClick={() => updateStatus(q._id, "important")}>
                Important
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionBoard;