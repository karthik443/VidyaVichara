import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function LectureBoard({ user }) {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/lecture");
      setLectures(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLectures();

    socket.on("newLecture", (l) => setLectures((prev) => [l, ...prev]));
    socket.on("updateLecture", (updated) =>
      setLectures((prev) =>
        prev.map((l) => (l._id === updated._id ? updated : l))
      )
    );

    return () => socket.off();
  }, []);

  // Teacher: create lecture
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "teacher") return;
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/lecture",
        { title },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  // Teacher: end lecture
  const handleEndLecture = async (id) => {
    if (user.role !== "teacher") return;
    try {
      await axios.post(
        `http://localhost:5000/lecture/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {user.role === "teacher" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Lecture Title"
            style={{ width: "80%", padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>
            Create Lecture
          </button>
        </form>
      )}

      <h3>All Lectures</h3>
      {lectures.map((l) => (
        <div
          key={l._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <p>
            <b>{l.title}</b>
          </p>
          <small>
            By: {l.lecturerName} | Status: {l.isLive}
          </small>
          {user.role === "teacher" && l.isLive === "Live" && (
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => handleEndLecture(l._id)}>End Lecture</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LectureBoard;
