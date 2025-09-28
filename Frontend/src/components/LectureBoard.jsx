// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import QuestionBoard from "./QuestionBoard";
// import "./Dashboard.css"; // unified CSS

// const socket = io("http://localhost:5000");

// function LectureBoard({ user }) {
//   const [lectures, setLectures] = useState([]);
//   const [title, setTitle] = useState("");
//   const [joinedLecture, setJoinedLecture] = useState(null); // current lecture

//   // Fetch lectures for teacher or student's joined lectures
//   const fetchLectures = async () => {
//   try {
//     const res = await axios.get("http://localhost:5000/lecture", {
//       headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
//       params: { userId: user._id } // fixed
//     });
//     setLectures(res.data);
//   } catch (err) {
//     console.error(err);
//   }
// };


//   const JoinLecture = (lecture) => {
//     setJoinedLecture(lecture);
//   };

//   const handleLeaveLecture = () => {
//     setJoinedLecture(null);
//   };

//   useEffect(() => {
//     fetchLectures();

//     socket.on("newLecture", (l) => setLectures((prev) => [l, ...prev]));
//     socket.on("updateLecture", (updated) =>
//       setLectures((prev) => prev.map((l) => (l._id === updated._id ? updated : l)))
//     );

//     return () => socket.off();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (user.role !== "teacher") return;
//     if (!title.trim()) return;

//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/lecture",
//         { title ,userId},
//         { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
//       );
//       setTitle("");
//       fetchLectures();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEndLecture = async (id) => {
//     if (user.role !== "teacher") return;
//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/lecture/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
//       );
//       fetchLectures();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Student: join lecture by access code
//   const handleJoinByAccessCode = async (e) => {
//     e.preventDefault();
//     if (!accessCode.trim()) return;

//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/lecture/join",
//         { accessId: accessCode },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAccessCode("");
//       fetchLectures(); // refresh lecture list after joining
//       alert("Successfully joined the lecture!");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error joining lecture");
//     }
//   };

//   useEffect(() => {
//     fetchLectures();

//     socket.on("newLecture", (l) => setLectures((prev) => [l, ...prev]));
//     socket.on("updateLecture", (updated) =>
//       setLectures((prev) => prev.map((l) => (l._id === updated._id ? updated : l)))
//     );

//     return () => socket.off();
//   }, []);

//   if (joinedLecture) {
//     return (
//       <QuestionBoard
//         user={user}
//         lecture={joinedLecture}
//         onLeave={handleLeaveLecture}
//       />
//     );
//   }

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto" }}>
//       {user.role === "teacher" && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Lecture Title"
//             style={{ width: "80%", padding: "8px" }}
//           />
//           <button type="submit" style={{ padding: "8px 12px" }}>
//             Create Lecture
//           </button>
//         </form>
//       )}

//       <h3>All Lectures</h3>
//       {lectures.map((l) => (
//         <div
//           key={l._id}
//           style={{
//             border: "1px solid #ccc",
//             padding: "10px",
//             marginBottom: "10px",
//             borderRadius: "5px",
//             boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
//           }}
//         >
//           <p><b>{l.title}</b></p>
//           <p>
//             <b
//               style={{ color: "blue", cursor: "pointer" }}
//               onClick={() => JoinLecture(l)}
//             >
//               Join
//             </b>
//           </p>
//           <small>
//             By: {l.lecturerName} | Status: {l.isLive}
//           </small>
//           {user.role === "teacher" && l.isLive === "Live" && (
//             <div style={{ marginTop: "5px" }}>
//               <button onClick={() => handleEndLecture(l._id)}>End Lecture</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {lectures.length === 0 && (
//         <div className="empty-state">
//           <h3>No lectures yet</h3>
//           <p>Create your first lecture to get started</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LectureBoard;



















// src/components/LectureBoard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import QuestionBoard from "./QuestionBoard";
import "./Dashboard.css"; // assuming unified CSS

const socket = io("http://localhost:5000");

function LectureBoard({ user }) {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const [joinedLecture, setJoinedLecture] = useState(null);
  const [accessCode, setAccessCode] = useState("");

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
    if (user.role !== "teacher") return;
    if (!title.trim()) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/lecture",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
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
      fetchLectures();
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

      {/* Lecture list */}
      {/* <div className="page-grid">
        {lectures.map((l) => (
          <div key={l._id} className="card">
            <div className="lecture-title">{l.title}</div>

            
            <span
              className={`lecture-status ${l.isLive === "Live" ? "live" : "closed"}`}
            >
              {l.isLive}
            </span>

            {user.role === "teacher" && (
              <div>Access Code: <b>{l.accessId}</b></div>
            )}

            {(user.role === "teacher" || (user.role === "student" && l.joinedLectures?.includes(user._id))) && (
              <p>
                <b
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => JoinLecture(l)}
                >
                  Join
                </b>
              </p>
            )}

            <div className="lecture-meta">
              By: {l.lecturerName} | Status: {l.isLive}
            </div>

            {user.role === "teacher" && l.isLive === "Live" && (
              <div className="lecture-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEndLecture(l._id)}
                >
                  End Lecture
                </button>
              </div>
            )}
          </div>
        ))}
      </div> */}










      <div className="page-grid">
        {user.role === "student"
  ? lectures
      .filter((l) => l.joinedLectures && l.joinedLectures.includes(user._id))
      .map((l) => (
        <div key={l._id} className="card">
          <div className="lecture-title">{l.title}</div>
          <span className={`lecture-status ${l.isLive === "Live" ? "live" : "closed"}`}>
            {l.isLive}
          </span>
          <p>
            <b
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => JoinLecture(l)}
            >
              Join
            </b>
          </p>
          <div className="lecture-meta">
            By: {l.lecturerName} | Status: {l.isLive}
          </div>
        </div>
      ))
  : lectures.map((l) => (
      <div key={l._id} className="card">
        <div className="lecture-title">{l.title}</div>
        <span className={`lecture-status ${l.isLive === "Live" ? "live" : "closed"}`}>
          {l.isLive}
        </span>
        {user.role === "teacher" && (
          <div>Access Code: <b>{l.accessId}</b></div>
        )}
        <p>
          <b
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => JoinLecture(l)}
          >
            Join
          </b>
        </p>
        <div className="lecture-meta">
          By: {l.lecturerName} | Status: {l.isLive}
        </div>
        {user.role === "teacher" && l.isLive === "Live" && (
          <div className="lecture-actions">
            <button
              className="btn btn-secondary"
              onClick={() => handleEndLecture(l._id)}
            >
              End Lecture
            </button>
          </div>
        )}
      </div>
    ))
}
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
