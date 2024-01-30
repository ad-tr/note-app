import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import "./App.css";
import Note from "./components/Note";

function App() {
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  async function fetchNotes() {
    const response = await fetch("/notes?_sort=id&_order=desc");
    const data = await response.json();
    const dataFiltered = data.filter((note) => !note.inTrash);
    setNotes(dataFiltered);
  }

  async function deleteNote(id) {
    await fetch(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ inTrash: true }),
      headers: { "Content-type": "application/json" },
    });
    fetchNotes();
  }

  async function checkNote(id, isChecked) {
    const updatedNote = { ...notes.find((note) => note.id === id), isChecked };
    await fetch(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedNote),
      headers: { "Content-Type": "application/json" },
    });
    fetchNotes();
  }

  async function createNote() {
    let newNote;
  
    try {
      const response = await fetch("/notes", {
        method: "POST",
        body: JSON.stringify({
          title: "Nouvelle note",
          content: "",
          inTrash: false,
          isChecked: false,
        }),
        headers: { "Content-type": "application/json" },
      });
  
      newNote = await response.json();
    } catch (error) {
      console.error("Erreur lors de la création de la note : ", error);
    }
    await fetchNotes();
    setSelectedNoteId(newNote.id);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <BrowserRouter>
      <aside className="Side">
        <div>
          <button className="Button Button-create-note" onClick={createNote}>
            +
          </button>
          {notes !== null ? (
            <ol className="Notes-list">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    className={`Note-link ${note.id === selectedNoteId ? 'selected' : ''}`}
                    to={`/notes/${note.id}`}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                    }}
                  >
                    {note.title}
                    <Link className="gg-trash" onClick={() => deleteNote(note.id)} to="/"></Link>
                    <span
                      className={note.isChecked ? "gg-radio-checked" : "gg-radio-check"}
                      onClick={() => checkNote(note.id, !note.isChecked)}
                    ></span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </aside>
      <main className="Main">
        <Routes>
          <Route path="/" element="Sélectionner une note" />
          <Route path="/notes/:id" element={<Note onSaveSuccess={fetchNotes} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
