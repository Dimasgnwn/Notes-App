class NoteLoading extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top: 4px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        :host {
          display: block;
          text-align: center;
          padding: 1rem;
        }
      </style>
      <div class="spinner"></div>
    `;
  }
}

customElements.define('note-loading', NoteLoading);
