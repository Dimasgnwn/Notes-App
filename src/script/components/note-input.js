import { addNote } from '../data/remote/notes-api.js';
import Swal from 'sweetalert2';
import '../components/note-list.js';

class NoteInput extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      h3 {
        color: #207DFF;
        margin-bottom: 10px;
      }
      .note-wrapper {
        margin: 0.7rem;
        padding: 0.5rem;
      }
      .btn {
        background: var(--bittersweet);
        border: 2px solid var(--bittersweet);
        color: white;
        padding: 0.55rem 0;
        width: 120px;
        border-radius: 2px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.5s ease-in-out;
      }
      .btn:focus {
        outline: 0;
      }
      .btn:hover {
        background: #0B192C;
        box-shadow: 0 0 8px 0 rgba(52, 76, 183, 1);
      }
      .note-input {
        margin: 0.7rem 0;
        padding: 0.5rem 0;
      }
      #note-title, #note-content {
        width: 100%;
        color: white;
        background-color: #0B192C;
        border: 2px solid rgba(52, 76, 183, 1);
        font-size: 1.05rem;
        padding: 0.55rem;
        margin-bottom: 0.8rem;
        border-radius: 2px;
      }
      #note-content {
        resize: none;
      }
      #note-title:focus, #note-content:focus {
        outline: 0;
      }
      label {
        color: white;
        font-size: 1.2rem;
        margin: 10px;
      }
    `;
  }

  connectedCallback() {
    this._addEventListeners();
  }

  render() {
    this._updateStyle();

    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(this._style);

    const template = document.createElement('div');
    template.innerHTML = `
      <div class="note-wrapper">
        <h3>Add A New Note:</h3>
        <form autocomplete="off">
          <div class="note-input">
            <label for="note-title">Title of Note</label>
            <input type="text" id="note-title" placeholder="Title of the note" required />
            <p id="titleValidation" class="validation-message" aria-live="polite"></p>
            <label for="note-content">Note</label>
            <textarea rows="5" placeholder="Write your note here ..." id="note-content" required></textarea>
          </div>
          <button type="button" class="btn" id="add-note-btn">
            <span><i class="fas fa-plus"></i></span>
            Add Note
          </button>
        </form>
      </div>
    `;

    this._shadowRoot.appendChild(template);
  }

  _addEventListeners() {
    const addButton = this.shadowRoot.querySelector('#add-note-btn');
    if (addButton) {
      addButton.addEventListener('click', () => this.saveNote()
    );
    }
  }

  async saveNote() {
    const title = this.shadowRoot.querySelector('#note-title').value.trim();
    const body = this.shadowRoot.querySelector('#note-content').value.trim();

    if (!title || !body) return;

    try {
      const newNote = await addNote({ title, body });

      this.dispatchEvent(
        new CustomEvent('note-added', {
          detail: newNote,
          bubbles: true,
          composed: true,
        })
      );

      Swal.fire({
        icon: 'success',
        title: 'Catatan ditambahkan!',
        showConfirmButton: false,
        timer: 1500
      });
      
      this.shadowRoot.querySelector('#note-title').value = '';
      this.shadowRoot.querySelector('#note-content').value = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menyimpan catatan. Coba lagi nanti!',
      });
    }
  }
}

customElements.define('note-input', NoteInput);
