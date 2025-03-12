import { getNotes, removeNote } from '../data/remote/notes-api.js';
import Swal from 'sweetalert2';

import '../components/note-loading.js';

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
        padding: 1rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      #notes-list > * {
        padding: 4px 8px;
        border: 1px solid #1D24CA;
      }
      .note-item {
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
      .item {
        padding : 5px;
      }
      .delete-btn {
        width: 100px;
        background: red;
        border: none;
        color: white;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
        border-radius: 3px;
      }
    `;
  }

  connectedCallback() {
    this.loadNotes();

    document.addEventListener('note-added', (event) => {
      this.loadNotes();
      this._addNoteToList(event.detail);
    });
  }

  render() {
    this._updateStyle();
    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    const container = document.createElement('div');
    container.classList.add('note-container');
    container.innerHTML = `<h3>Your Notes</h3><div id="notes-list"></div>`;
    this._shadowRoot.appendChild(container);
  }

  async loadNotes() {
    const notesList = this._shadowRoot.querySelector('#notes-list');
    notesList.innerHTML = `<note-loading></note-loading>`;

    try {
      const notes = await getNotes();
      notesList.innerHTML = '';
      notes.forEach((note) => this._createNoteElement(note));
    } catch (error) {
      notesList.innerHTML = '<p style="color:red">Gagal memuat data.</p>';
    }
  }

  renderNotes(notes) {
    notes.forEach((note) => {
      this._createNoteElement(note);
    });
  }

  _createNoteElement(note) {
    const notesList = this._shadowRoot.querySelector('#notes-list');

    const noteItem = document.createElement('div');
    noteItem.classList.add('note-item');
    noteItem.setAttribute('data-id', note.id);

    noteItem.innerHTML = `
      <h3 class = "item">${note.title}</h3>
      <p class="item">${note.body}</p>
      <button class="delete-btn">Delete</button>
    `;

    noteItem.querySelector('.delete-btn').addEventListener('click', () => {
      this._deleteNote(note.id, noteItem);
    });

    notesList.appendChild(noteItem);
  }

  _addNoteToList(note) {
    this._createNoteElement(note);
  }

  async _deleteNote(noteId, noteElement) {
    try {
      await removeNote(noteId);
      noteElement.remove();
      this.loadNotes();
      Swal.fire({
        icon: 'warning',
        title: 'Berhasil menghapus catatan',
        showConfirmButton: true,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus catatan',
        text: error.message || 'Terjadi kesalahan saat menghapus data.',
      });
    }
  }

  clearNotes() {
    this.notes = [];
    this.render();
  }
}

customElements.define('note-list', NoteList);
