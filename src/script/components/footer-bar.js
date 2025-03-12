class FooterBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _updateStyle() {
    this._style.textContent = `
   
        marquee {
          padding : 10px 0;
          color: white;
          background-color:#1D24CA;
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
        }
      `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += ` 
            <div> 
            <marquee direction="left" scrollamount="30">Dimas Gunawan || Dicoding &copy; Front-End Intermediate</marquee>
            </div>
      `;
  }
}

customElements.define('footer-bar', FooterBar);
