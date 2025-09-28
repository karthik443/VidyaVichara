// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import QuestionBoard from "./QuestionBoard";

// const socket = io("http://localhost:5000");

// function LectureBoard({ user }) {
//   const [lectures, setLectures] = useState([]);
//   const [title, setTitle] = useState("");
//   const [joinedLecture, setJoinedLecture] = useState(null);
//   const [accessCode, setAccessCode] = useState(""); // for student join

//   // Fetch lectures for teacher or student's joined lectures
//   const fetchLectures = async () => {
//     try {
//       const token = sessionStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/lecture", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { userId: user._id },
//       });
//       setLectures(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Join lecture
//   const JoinLecture = (lecture) => {
//     setJoinedLecture(lecture);
//   };

//   const handleLeaveLecture = () => {
//     setJoinedLecture(null);
//   };

//   // Teacher: create lecture
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (user.role !== "teacher") return;
//     if (!title.trim()) return;

//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/lecture",
//         { title },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTitle("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Teacher: end lecture
//   const handleEndLecture = async (id) => {
//     if (user.role !== "teacher") return;
//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/lecture/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
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

//   // If joined, show QuestionBoard
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
//       {/* Teacher: create lecture */}
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

//       {/* Student: join lecture by access code */}
//       {user.role === "student" && (
//         <form
//           onSubmit={handleJoinByAccessCode}
//           style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
//         >
//           <input
//             type="text"
//             value={accessCode}
//             onChange={(e) => setAccessCode(e.target.value)}
//             placeholder="Enter Access Code"
//             style={{ flex: 1, padding: "8px" }}
//           />
//           <button type="submit" style={{ padding: "8px 12px" }}>
//             Join Lecture
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

//           {/* Show access code only to teacher */}
//           {user.role === "teacher" && (
//             <p>Access Code: <b>{l.accessId}</b></p>
//           )}

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
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default LectureBoard;






import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import QuestionBoard from "./QuestionBoard";

const socket = io("http://localhost:5000");

function LectureBoard({ user }) {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const [joinedLecture, setJoinedLecture] = useState(null);
  const [accessCode, setAccessCode] = useState(""); // for student join

  // Fetch lectures for teacher or student's joined lectures
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

  // Join lecture
  const JoinLecture = (lecture) => {
    setJoinedLecture(lecture);
  };

  const handleLeaveLecture = () => {
    setJoinedLecture(null);
  };

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
      fetchLectures(); // refresh lecture list after joining
      alert("Successfully joined the lecture!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error joining lecture");
    }
  };

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
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {/* Teacher: create lecture */}
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

      {/* Student: join lecture by access code */}
      {user.role === "student" && (
        <form
          onSubmit={handleJoinByAccessCode}
          style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter Access Code"
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>
            Join Lecture
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
          <p><b>{l.title}</b></p>

          {/* Show access code only to teacher */}
          {user.role === "teacher" && (
            <p>Access Code: <b>{l.accessId}</b></p>
          )}

         {/* Join button (only for teacher to preview, not for student) */}
          
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

