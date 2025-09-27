<<<<<<< HEAD
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// function QuestionBoard({ user }) {
//   const [questions, setQuestions] = useState([]);
//   const [text, setText] = useState("");
//   const [filter, setFilter] = useState("recent");

//   const fetchQuestions = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/questions");
//       setQuestions(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();

//     socket.on("newQuestion", (q) => setQuestions((prev) => [q, ...prev]));
//     socket.on("updateQuestion", (updated) =>
//       setQuestions((prev) =>
//         prev.map((q) => (q._id === updated._id ? updated : q))
//       )
//     );
//     socket.on("deleteQuestion", (deleted) =>
//       setQuestions((prev) => prev.filter((q) => q._id !== deleted._id))
//     );
//     socket.on("clearQuestions", () => setQuestions([]));

//     return () => {
//       socket.off("newQuestion");
//       socket.off("updateQuestion");
//       socket.off("deleteQuestion");
//       socket.off("clearQuestions");
//     };
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     try {
//       await axios.post(
//         "http://localhost:5000/questions",
//         { text, author: user.name },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     if (user.role !== "teacher") return;
//     try {
//       await axios.patch(
//         `http://localhost:5000/questions/${id}`,
//         { status },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteQuestion = async (id) => {
//     if (user.role !== "teacher") return;
//     try {
//       await axios.post(
//         "http://localhost:5000/questions/delete",
//         { _id: id },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setQuestions((prev) => prev.filter((q) => q._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const clearAll = async () => {
//     if (user.role !== "teacher") return;
//     try {
//       await axios.post("http://localhost:5000/questions", {
//   text,
//   author: user?.name || "Anonymous",
// }, {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const getFilteredQuestions = () => {
//     if (filter === "recent") {
//       const sorted = [...questions].sort(
//         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//       return sorted.slice(0, 5);
//     }
//     return questions.filter((q) => q.status === filter);
//   };

//   const filteredQuestions = getFilteredQuestions();

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto" }}>
//       <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Enter your question"
//           style={{ width: "80%", padding: "8px" }}
//         />
//         <button type="submit" style={{ padding: "8px 12px" }}>
//           Ask
//         </button>
//       </form>

//       <div style={{ margin: "10px 0" }}>
//         <label htmlFor="filter">Filter: </label>
//         <select
//           id="filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="recent">Recent</option>
//           <option value="unanswered">Unanswered</option>
//           <option value="answered">Answered</option>
//         </select>
//       </div>

//       {user.role === "teacher" && (
//         <button onClick={clearAll} style={{ marginBottom: "10px" }}>
//           Clear All Questions
//         </button>
//       )}

//       <div>
//         {filteredQuestions.map((q) => (
//           <div
//             key={q._id}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginBottom: "10px",
//               borderRadius: "5px",
//               boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
//             }}
//           >
//             <p>{q.text}</p>
//             <small>
//               Author: {q.author} | Status: {q.status}
//             </small>
//             {user.role === "teacher" && (
//               <div style={{ marginTop: "5px" }}>
//                 <button onClick={() => updateStatus(q._id, "answered")}>
//                   Answered
//                 </button>
//                 <button onClick={() => updateStatus(q._id, "important")}>
//                   Important
//                 </button>
//                 <button onClick={() => deleteQuestion(q._id)}>Delete</button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default QuestionBoard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// function QuestionBoard({ user }) {
//   const [questions, setQuestions] = useState([]);
//   const [text, setText] = useState("");
//   const [filter, setFilter] = useState("recent");

//   // Fetch questions
//   const fetchQuestions = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/questions");
//       setQuestions(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();

//     socket.on("newQuestion", (q) => setQuestions((prev) => [q, ...prev]));
//     socket.on("updateQuestion", (updated) =>
//       setQuestions((prev) =>
//         prev.map((q) => (q._id === updated._id ? updated : q))
//       )
//     );
//     socket.on("deleteQuestion", (deleted) =>
//       setQuestions((prev) => prev.filter((q) => q._id !== deleted._id))
//     );
//     socket.on("clearQuestions", () => setQuestions([]));

//     return () => {
//       socket.off("newQuestion");
//       socket.off("updateQuestion");
//       socket.off("deleteQuestion");
//       socket.off("clearQuestions");
//     };
//   }, []);

//   // Students submit questions
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (user.role !== "student") return;
//     if (!text.trim()) return;

//     try {
//       await axios.post(
//         "http://localhost:5000/questions",
//         { text, author: user.name },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Teacher clicks “Add Answer”
//   const handleAddAnswerClick = (id) => {
//     setQuestions((prev) =>
//       prev.map((q) => (q._id === id ? { ...q, addingAnswer: true } : q))
//     );
//   };

//   // Teacher types answer
//   const handleAnswerChange = (id, value) => {
//     setQuestions((prev) =>
//       prev.map((q) => (q._id === id ? { ...q, tempAnswer: value } : q))
//     );
//   };

//   // Local submit of answer (no backend yet)
//   const handleAnswerSubmit = (id) => {
//     setQuestions((prev) =>
//       prev.map((q) =>
//         q._id === id
//           ? {
//               ...q,
//               answer: q.tempAnswer || "Not Answerd",
//               addingAnswer: false,
//               tempAnswer: "",
//               status: "answered",
//             }
//           : q
//       )
//     );
//   };

//   const getFilteredQuestions = () => {
//     if (filter === "recent") {
//       const sorted = [...questions].sort(
//         (a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//       return sorted.slice(0, 5);
//     }
//     return questions.filter((q) => q.status === filter);
//   };

//   const filteredQuestions = getFilteredQuestions();

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto" }}>
//       {/* Students can ask */}
//       {user.role === "student" && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Enter your question"
//             style={{ width: "80%", padding: "8px" }}
//           />
//           <button type="submit" style={{ padding: "8px 12px" }}>
//             Ask
//           </button>
//         </form>
//       )}

//       <div style={{ margin: "10px 0" }}>
//         <label htmlFor="filter">Filter: </label>
//         <select
//           id="filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="recent">Recent</option>
//           <option value="unanswered">Unanswered</option>
//           <option value="answered">Answered</option>
//         </select>
//       </div>

//       <div>
//         {filteredQuestions.map((q) => (
//           <div
//             key={q._id}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginBottom: "10px",
//               borderRadius: "5px",
//               boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
//             }}
//           >
//             <p>{q.text}</p>
//             <small>
//               Author: {q.author} | Status: {q.status}
//             </small>

//             {/* Display answer if exists */}
//             {q.answer && q.answer !== "Not Answerd" && (
//               <p style={{ color: "green", marginTop: "5px" }}>
//                 <b>Answer:</b> {q.answer}
//               </p>
//             )}

//             {/* Teachers can add answer */}
//             {user.role === "teacher" && q.answer === "Not Answerd" && (
//               <div style={{ marginTop: "10px" }}>
//                 {!q.addingAnswer ? (
//                   <button onClick={() => handleAddAnswerClick(q._id)}>
//                     Add Answer
//                   </button>
//                 ) : (
//                   <div>
//                     <textarea
//                       value={q.tempAnswer || ""}
//                       onChange={(e) =>
//                         handleAnswerChange(q._id, e.target.value)
//                       }
//                       rows={3}
//                       placeholder="Type your answer here..."
//                       style={{ width: "100%", padding: "5px" }}
//                     />
//                     <button onClick={() => handleAnswerSubmit(q._id)}>
//                       Submit Answer
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default QuestionBoard;


=======
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function QuestionBoard({ user }) {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("recent");
<<<<<<< HEAD
=======
  const role = localStorage.getItem("role") || "student"; // ✅ get role from login
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765

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
<<<<<<< HEAD
      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updated : q))
      )
=======
      setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)))
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
    );
    socket.on("deleteQuestion", (deleted) =>
      setQuestions((prev) => prev.filter((q) => q._id !== deleted._id))
    );
    socket.on("clearQuestions", () => setQuestions([]));

    return () => socket.off();
  }, []);

  // Student: submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "student") return;
    if (!text.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/questions",
        { text, author: user.name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

<<<<<<< HEAD
  // Teacher: update status
=======
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
  const updateStatus = async (id, status) => {
    if (user.role !== "teacher") return;
    try {
      await axios.patch(
        `http://localhost:5000/questions/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

<<<<<<< HEAD
  // Teacher: delete question
=======
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
  const deleteQuestion = async (id) => {
    if (user.role !== "teacher") return;
    try {
<<<<<<< HEAD
      await axios.post(
        "http://localhost:5000/questions/delete",
        { _id: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
=======
      await axios.post("http://localhost:5000/questions/delete", { _id: id });
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete("http://localhost:5000/questions");
    } catch (err) {
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
      console.error(err);
    }
  };

<<<<<<< HEAD
  // Teacher: add answer (local for now)
  const handleAddAnswerClick = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, addingAnswer: true } : q))
    );
  };

  const handleAnswerChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, tempAnswer: value } : q))
    );
  };

  const handleAnswerSubmit = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id
          ? {
              ...q,
              answer: q.tempAnswer || "Not Answerd",
              addingAnswer: false,
              tempAnswer: "",
              status: "answered",
            }
          : q
      )
    );
  };

  const getFilteredQuestions = () => {
    if (filter === "recent") {
      const sorted = [...questions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted.slice(0, 5);
=======
  const getFilteredQuestions = () => {
    if (filter === "recent") {
      return [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
>>>>>>> 2bb48ca1b5acd2c318012eca24ac8b526a675765
    }
    return questions.filter((q) => q.status === filter);
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {/* Student ask */}
      {user.role === "student" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your question"
            style={{ width: "80%", padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>
            Ask
          </button>
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

      {user.role === "teacher" && (
        <button style={{ marginBottom: "10px" }}>Clear All Questions</button>
      )}

      <div>
        {filteredQuestions.map((q) => (
          <div
            key={q._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            <p>{q.text}</p>
            <small>
              Author: {q.author} | Status: {q.status}
            </small>

            {/* Teacher buttons */}
            {user.role === "teacher" && (
              <div style={{ marginTop: "5px" }}>
                <button onClick={() => updateStatus(q._id, "answered")}>
                  Answered
                </button>
                <button onClick={() => updateStatus(q._id, "important")}>
                  Important
                </button>
                <button onClick={() => deleteQuestion(q._id)}>Delete</button>
              </div>
            )}

            {/* Add Answer */}
            {user.role === "teacher" && q.answer === "Not Answerd" && (
              <div style={{ marginTop: "10px" }}>
                {!q.addingAnswer ? (
                  <button onClick={() => handleAddAnswerClick(q._id)}>
                    Add Answer
                  </button>
                ) : (
                  <div>
                    <textarea
                      value={q.tempAnswer || ""}
                      onChange={(e) =>
                        handleAnswerChange(q._id, e.target.value)
                      }
                      rows={3}
                      placeholder="Type your answer here..."
                      style={{ width: "100%", padding: "5px" }}
                    />
                    <button onClick={() => handleAnswerSubmit(q._id)}>
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Display Answer */}
            {q.answer && q.answer !== "Not Answerd" && (
              <p style={{ color: "green", marginTop: "5px" }}>
                <b>Answer:</b> {q.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionBoard;











