// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import QuestionBoard from "./QuestionBoard";
// import "./Dashboard.css"; // unified CSS

// const socket = io("http://localhost:5000");

// function LectureBoard({ user }) {
//   const [lectures, setLectures] = useState([]);
//   const [title, setTitle] = useState("");
//   const [joinedLecture, setJoinedLecture] = useState(null);

//   const fetchLectures = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/lecture", {
//         headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
//         params: { userId: user._id },
//       });
//       setLectures(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const JoinLecture = (lecture) => setJoinedLecture(lecture);
//   const handleLeaveLecture = () => setJoinedLecture(null);

//   useEffect(() => {
//     fetchLectures();
//     socket.on("newLecture", (l) => setLectures((prev) => [l, ...prev]));
//     socket.on("updateLecture", (updated) =>
//       setLectures((prev) =>
//         prev.map((l) => (l._id === updated._id ? updated : l))
//       )
//     );
//     return () => socket.off();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (user.role !== "teacher") return;
//     if (!title.trim()) return;

//     try {
//       const userId = user._id;
//       await axios.post(
//         "http://localhost:5000/lecture",
//         { title, userId },
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//           },
//         }
//       );
//       setTitle("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEndLecture = async (id) => {
//     if (user.role !== "teacher") return;
//     try {
//       await axios.post(
//         `http://localhost:5000/lecture/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//           },
//         }
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

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
//     <div className="page">
//       <div className="page-header">
//         <div>
//           <div className="page-title">Welcome back, {user.name}</div>
//           <div className="page-sub">Ready to inspire minds today? ✨</div>
//         </div>

//         {user.role === "teacher" && (
//           <form
//             onSubmit={handleSubmit}
//             style={{ display: "flex", gap: "8px" }}
//           >
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter Lecture Title"
//               className="input-box"
//             />
//             <button type="submit" className="btn btn-primary">
//               + Create Lecture
//             </button>
//           </form>
//         )}
//       </div>

//       <div className="page-grid">
//         {lectures.map((l) => (
//           <div key={l._id} className="card">
//             <div className="lecture-title">{l.title}</div>
//             <span
//               className={`lecture-status ${
//                 l.isLive === "Live" ? "live" : "closed"
//               }`}
//             >
//               {l.isLive}
//             </span>

//             <div className="lecture-code">
//               <span>{l._id.slice(-6).toUpperCase()}</span>
//               <button
//                 className="copy-btn"
//                 onClick={() => navigator.clipboard.writeText(l._id)}
//               >
//                 Copy
//               </button>
//             </div>

//             <div className="lecture-meta">
//               By: {l.lecturerName} | Status: {l.isLive}
//             </div>

//             <div className="lecture-actions">
//               <button className="btn btn-primary" onClick={() => JoinLecture(l)}>
//                 Open Board
//               </button>
//               {user.role === "teacher" && l.isLive === "Live" && (
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => handleEndLecture(l._id)}
//                 >
//                   End
//                 </button>
//               )}
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

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/lecture", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        params: { userId: user._id },
      });
      setLectures(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const JoinLecture = (lecture) => setJoinedLecture(lecture);
  const handleLeaveLecture = () => setJoinedLecture(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "teacher") return;
    if (!title.trim()) return;

    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndLecture = async (id) => {
    if (user.role !== "teacher") return;
    try {
      await axios.post(
        `http://localhost:5000/lecture/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

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

        {user.role === "teacher" && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "8px" }}
          >
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
      </div>

      <div className="page-grid">
        {lectures.map((l) => (
          <div key={l._id} className="card">
            <div className="lecture-title">{l.title}</div>
            <span
              className={`lecture-status ${
                l.isLive === "Live" ? "live" : "closed"
              }`}
            >
              {l.isLive}
            </span>

            {/* ❌ Copy code removed completely */}

            <div className="lecture-meta">
              By: {l.lecturerName} | Status: {l.isLive}
            </div>

            <div className="lecture-actions">
              <button className="btn btn-primary" onClick={() => JoinLecture(l)}>
                Open Board
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
