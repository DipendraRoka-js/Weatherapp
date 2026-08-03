import { useEffect, useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  function addStudent(student) {
    setStudents([...students, student]);
  }

  function deleteStudent(id) {
    setStudents(students.filter((student) => student.id !== id));
  }

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.age - a.age;
    });

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <StudentForm onAdd={addStudent} />

      <input
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="age">Sort by Age</option>
      </select>

      <StudentList
        students={filteredStudents}
        onDelete={deleteStudent}
      />
    </div>
  );
}

export default App;