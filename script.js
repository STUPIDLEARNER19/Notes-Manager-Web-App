// Utility: Fetch & Save Notes
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Add Note
function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) {
    showAlert("Please fill in all fields!", "notesErrorAlert");
    return;
  }

  const notes = getNotes();
  const newNote = { id: Date.now(), title, content, createdAt: new Date().toLocaleString() };
  notes.push(newNote);
  saveNotes(notes);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  showAlert("Note added successfully!", "notesSuccessAlert");
  renderNotes();
  updateDashboard();
  updateAdminPanel();
}

// Render Notes
function renderNotes() {
  const notesList = document.getElementById("notesList");
  if (!notesList) return;

  const notes = getNotes();
  notesList.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note-card");
    div.setAttribute("data-id", note.id);
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <small>Created at: ${note.createdAt}</small><br>
      <button class="btn btn-danger" onclick="deleteNote(${note.id})">Delete</button>
    `;
    notesList.appendChild(div);
  });
}


// Alerts
function showAlert(message, id) {
  const alert = document.getElementById(id);
  if (alert) {
    alert.innerText = message;
    alert.style.display = "block";
    setTimeout(() => (alert.style.display = "none"), 2000);
  }
}

// Dashboard Update
function updateDashboard() {
  const notes = getNotes();
  const totalNotes = document.getElementById("totalNotes");
  const latestNote = document.getElementById("latestNote");

  if (totalNotes) totalNotes.innerText = `Total Notes: ${notes.length}`;
  if (latestNote) {
    latestNote.innerText = notes.length > 0 ? `Latest Note: ${notes[notes.length - 1].title}` : "No notes yet.";
  }
}

// Admin Update
function updateAdminPanel() {
  const notes = getNotes();
  const adminNotesList = document.getElementById("adminNotesList");
  if (!adminNotesList) return;

  adminNotesList.innerHTML = "";
  notes.forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note-card");
    div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p><small>Created: ${note.createdAt}</small>`;
    adminNotesList.appendChild(div);
  });
}

// Delete Note with Modal
let noteToDelete = null;

function deleteNote(noteId) {
  noteToDelete = noteId;
  document.getElementById("deleteModal").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (noteToDelete) {
        const notes = getNotes().filter(note => note.id !== noteToDelete);
        saveNotes(notes);
        renderNotes();
        updateDashboard();
        updateAdminPanel();
        showAlert("Note deleted successfully!", "notesSuccessAlert");
        noteToDelete = null;
      }
      document.getElementById("deleteModal").style.display = "none";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      noteToDelete = null;
      document.getElementById("deleteModal").style.display = "none";
    });
  }

  renderNotes();
});
