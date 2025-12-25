import React, { useState, useRef, useEffect } from 'react';

const getInitialNotes = () => {
  const storedNotes = localStorage.getItem('notes');
  return storedNotes ? JSON.parse(storedNotes) : [];
};

const NotesApp = () => {
  const [notes, setNotes] = useState(getInitialNotes);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const newNoteInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const text = newNoteText.trim();
    if (text) {
      const newNote = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleString(),
      };
      setNotes([...notes, newNote]);
      setNewNoteText('');
      newNoteInputRef.current.focus(); 
    }
  };

  const handleEditStart = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEditSave = (id) => {
    const text = editingText.trim();
    if (text) {
      setNotes(notes.map(note =>
        note.id === id ? { ...note, text: text } : note
      ));
      setEditingId(null);
      setEditingText('');
    }
  }; 

  const handleDeleteNote = (id) => {
  
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className="notes-app-container">
      <header className="app-header">
        <h1>Notes App Syntecxhub</h1>
      </header>

      <form className="add-note-form" onSubmit={handleAddNote}>
        <input
          type="text"
          placeholder="Enter a new note..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          ref={newNoteInputRef}
        />
        <button type="submit" disabled={!newNoteText.trim()}>
          Add Note
        </button>
      </form>

      <div className="notes-list-container">
        {notes.length === 0 ? (
          <p className="empty-message">You have no notes. Start by adding one above!</p>
        ) : (
          <ul className="notes-list">
            {notes.slice().reverse().map(note => ( // Reverse to show latest first
              <li key={note.id} className="note-item">
                {editingId === note.id ? (
        
                  <>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows="3"
                    />
                    <div className="note-actions">
                      <button className="save-btn" onClick={() => handleEditSave(note.id)}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
  
                  <>
                    <p className="note-text">{note.text}</p>
                    <small className="note-timestamp">Created: {note.timestamp}</small>
                    <div className="note-actions">
                      <button className="edit-btn" onClick={() => handleEditStart(note.id, note.text)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h4 className="footer-text">© Made with ❤️ by Sufyan Ahmed. All rights reserved.</h4>
    </div>
  );
};

export default NotesApp;