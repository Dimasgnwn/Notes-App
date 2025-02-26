import { sampleNotes } from '../data/local/sample-notes.js';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      .note-container {
        background: #0B192C;
        border-radius: 5px;
        color: white;
      }
      #notes-list {
      padding : 1rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

    #notes-list>* {
      padding: 4px 8px;
      border: 1px solid #1D24CA;
      }
    .note-item{
        background: #0B192C;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 2px;
        box-shadow: 0 0 15px 0 rgba(52, 76, 183, 1);
    }
    .note-item:hover {
      transition-duration: 1s;
        transform: scale(1.1);
    }
      .delete-btn {
        width : 100px;
        background: red;
        border: none;
        color: white;
        padding:10px;
        margin : 10px;
        cursor: pointer;
        border-radius: 3px;
      }
    `;
  }

  connectedCallback() {
    this._loadNotes(); // Muat catatan saat komponen pertama kali dipasang

    // Tangkap event dari `note-input`
    document.addEventListener("note-added", (event) => {
      this._addNoteToList(event.detail);
    });
  }

  render() {
    this._updateStyle();
    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    const container = document.createElement('div');
    container.classList.add("note-container");
    container.innerHTML = `<h3>Your Notes</h3><div id="notes-list"></div>`;
    this._shadowRoot.appendChild(container);
  }

  _loadNotes() {
    const notesList = this._shadowRoot.querySelector("#notes-list");
    notesList.innerHTML = '';

    let storedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    // Gabungkan sampleNotes + storedNotes, pastikan tidak ada duplikasi berdasarkan id
    const combinedNotes = [...sampleNotes, ...storedNotes.filter(sn => !sampleNotes.some(s => s.id === sn.id))];

    combinedNotes.forEach(note => this._createNoteElement(note));
  }

  _createNoteElement(note) {
    const notesList = this._shadowRoot.querySelector("#notes-list");

    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.setAttribute("data-id", note.id);

    noteItem.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <button class="delete-btn">Delete</button>
    `;

    noteItem.querySelector(".delete-btn").addEventListener("click", () => {
      this._deleteNote(note.id, noteItem);
    });

    notesList.appendChild(noteItem);
  }

  _addNoteToList(note) {
    this._createNoteElement(note);
  }

  _deleteNote(noteId, noteElement) {
    let storedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    // Filter dan hapus dari localStorage (tidak mempengaruhi sampleNotes)
    storedNotes = storedNotes.filter(note => note.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(storedNotes));

    noteElement.remove();
  }
  clearNotes() {
    this.notes = [];
    this.render();
  }
}

customElements.define('note-list', NoteList);
