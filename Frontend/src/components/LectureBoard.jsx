import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import QuestionBoard from "./QuestionBoard";
import "./Dashboard.css"; // unified CSS

const socket = io("http://localhost:5000");

function LectureBoard({ user }) {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const [joinedLecture, setJoinedLecture] = useState(null);
  const [accessCode, setAccessCode] = useState(""); // For student joining

  // Fetch lectures (teacher: all, student: their joined lectures)
  const fetchLectures = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/lecture", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: user._id },
      });
      setLectures(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Join a lecture
  const JoinLecture = (lecture) => setJoinedLecture(lecture);
  const handleLeaveLecture = () => setJoinedLecture(null);

  // Teacher: create lecture
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "teacher" || !title.trim()) return;

    try {
      const token = sessionStorage.getItem("token");
      console.log(user);
      const userId = user._id;
      await axios.post(
        "http://localhost:5000/lecture",
        { title, userId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setTitle("");
      fetchLectures();
    } catch (err) {
      console.error(err);
    }
  };

  // Teacher: end lecture
  const handleEndLecture = async (id) => {
    if (user.role !== "teacher") return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/lecture/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLectures();
    } catch (err) {
      console.error(err);
    }
  };

  // Student: join lecture by access code
  const handleJoinByAccessCode = async (e) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/lecture/join",
        { accessId: accessCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccessCode("");
      fetchLectures(); // refresh lectures so the student can now see/join
      alert("Successfully joined the lecture!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error joining lecture");
    }
  };

  // Socket.io real-time updates
  useEffect(() => {
    fetchLectures();

    socket.on("newLecture", (l) => setLectures((prev) => [l, ...prev]));
    socket.on("updateLecture", (updated) =>
      setLectures((prev) => prev.map((l) => (l._id === updated._id ? updated : l)))
    );

    return () => socket.off();
  }, []);

  // If joined, show QuestionBoard
  if (joinedLecture) {
    return (
      <QuestionBoard
        user={user}
        lecture={joinedLecture}
        onLeave={handleLeaveLecture}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {user.name}</div>
          <div className="page-sub">Ready to inspire minds today? ✨</div>
        </div>

        {/* Teacher: create lecture */}
        {user.role === "teacher" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Lecture Title"
              className="input-box"
            />
            <button type="submit" className="btn btn-primary">
              + Create Lecture
            </button>
          </form>
        )}

        {/* Student: join by access code */}
        {user.role === "student" && (
          <form
            onSubmit={handleJoinByAccessCode}
            style={{ display: "flex", gap: "8px", marginTop: "10px" }}
          >
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter Access Code"
              className="input-box"
            />
            <button type="submit" className="btn btn-primary">
              Join Lecture
            </button>
          </form>
        )}
      </div>

      <div className="page-grid">
  {user.role === "student"
    ? lectures
        .filter((l) => l.joinedLectures && l.joinedLectures.includes(user._id))
        .map((l) => (
          <div key={l._id} className="card p-4 shadow rounded-2xl">
            <div className="lecture-title text-xl font-bold">{l.title}</div>
            <span
              className={`lecture-status inline-block px-2 py-1 mt-1 rounded-full text-sm font-medium ${
                l.isLive === "Live" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
              }`}
            >
              {l.isLive}
            </span>
            <div className="lecture-meta text-gray-600 mt-2">
              By: <span className="font-medium">{l.lecturerName}</span>
            </div>
            <div className="lecture-time text-sm text-gray-500 mt-1">
              {l.startTime && (
                <div>
                  🟢 <strong>Start:</strong> {new Date(l.startTime).toLocaleString()}
                </div>
              )}
              {l.endTime && (
                <div>
                  🔴 <strong>End:</strong> {new Date(l.endTime).toLocaleString()}
                </div>
              )}
            </div>
            <div className="lecture-actions mt-4 flex gap-2">
              <button className="btn btn-primary" onClick={() => JoinLecture(l)}>
                Join Lecture
              </button>
            </div>
          </div>
        ))
    : lectures.map((l) => (
        <div key={l._id} className="card p-4 shadow rounded-2xl">
          <div className="lecture-title text-xl font-bold">{l.title}</div>
          <span
            className={`lecture-status inline-block px-2 py-1 mt-1 rounded-full text-sm font-medium ${
              l.isLive === "Live" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
            }`}
          >
            {l.isLive}
          </span>
          <div className="lecture-meta text-gray-600 mt-2">
            By: <span className="font-medium">{l.lecturerName}</span>
            {user.role === "teacher" && (
              <div style={{ marginTop: 4 }}>
                <span style={{ fontWeight: 500 }}>Access Code:</span>{" "}
                <span
                  style={{
                    fontFamily: "monospace",
                    background: "#f3f3f3",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {l.accessId}
                </span>
              </div>
            )}
          </div>
          <div className="lecture-time text-sm text-gray-500 mt-1">
            {l.startTime && (
              <div>
                🟢 <strong>Start:</strong> {new Date(l.startTime).toLocaleString()}
              </div>
            )}
            {l.endTime && (
              <div>
                🔴 <strong>End:</strong> {new Date(l.endTime).toLocaleString()}
              </div>
            )}
          </div>
          <div className="lecture-actions mt-4 flex gap-2">
            <button className="btn btn-primary" onClick={() => JoinLecture(l)}>
              Join Lecture
            </button>
            {user.role === "teacher" && l.isLive === "Live" && (
              <button
                className="btn btn-secondary"
                onClick={() => handleEndLecture(l._id)}
              >
                End
              </button>
            )}
          </div>
        </div>
      ))}
</div>

      {/* Empty state */}
      {lectures.length === 0 && (
        <div className="empty-state">
          <h3>No lectures yet</h3>
          <p>Create your first lecture to get started</p>
        </div>
      )}
    </div>
  );
}

export default LectureBoard;
