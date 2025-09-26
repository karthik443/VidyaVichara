// src/components/QuestionBoard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // connect to backend socket

function QuestionBoard() {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent"); // filter state

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

    // Listen for deletes
    socket.on("deleteQuestion", (deleted) => {
      setQuestions((prev) => prev.filter((q) => q._id !== deleted._id));
    });

    // Listen for clear
    socket.on("clearQuestions", () => setQuestions([]));

    return () => {
      socket.off("newQuestion");
      socket.off("updateQuestion");
      socket.off("deleteQuestion");
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

  // Delete a question
  const deleteQuestion = async (id) => {
    try {
      await axios.post("http://localhost:5000/questions/delete", { _id: id });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
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

  // Filtered questions based on dropdown
  const getFilteredQuestions = () => {
    if (filter === "recent") {
      // Sort by creation time descending (assumes questions have a createdAt field)
      const sorted = [...questions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sorted.slice(0, 5); // Only latest 5
    }

    return questions.filter((q) => q.status === filter);
  };

  const filteredQuestions = getFilteredQuestions();

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

      <div style={{ margin: "10px 0" }}>
        <label htmlFor="filter">Filter: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="recent">Recent</option>
          <option value="unanswered">Unanswered</option>
          <option value="answered">Answered</option>
        </select>
      </div>

      <button onClick={clearAll}>Clear All Questions</button>

      <div>
        {filteredQuestions.map((q) => (
          <div key={q._id}>
            <p>{q.text}</p>
            <small>Status: {q.status}</small>
            <div>
              <button onClick={() => updateStatus(q._id, "answered")}>
                Answered
              </button>
              <button onClick={() => updateStatus(q._id, "important")}>
                Important
              </button>
              <button onClick={() => deleteQuestion(q._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionBoard;
