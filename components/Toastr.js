class Toast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px;
          border-radius: 5px;
          color: #fff;
          z-index: 9999;
          animation: fadeIn 0.3s ease forwards;
        }
        .success {
          background-color: #49c365f0;
          border: 4px solid #229957;
        }
        .error {
            background-color: #e14865d9;
            border: 4px solid crimson;
        }
        .info {
          background-color: #3bb9cdc7;
          border: 4px solid #17a2b8;
        }
        #toast {
          padding: 1em 2em;
          font-size: xx-large;
          border-radius: 10px;
        }
        .fade-out {
          animation: fadeOut 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      </style>
      <div id="toast"></div>
    `;
    }

    connectedCallback() {
        this.hideWithoutAnimation();
    }

    // Method to show the toast
    show(level, message, duration) {
        const toast = this.shadowRoot.querySelector('#toast');
        toast.textContent = message;
        toast.classList.add(level);
        this.style.display = 'block';
        setTimeout(() => {
            this.hide();
        }, duration);
    }

    // Method to hide the toast
    hide() {
        const toast = this.shadowRoot.querySelector('#toast');
        toast.classList.add('fade-out');
        setTimeout(() => {
            this.hideWithoutAnimation();
            toast.classList.remove('fade-out');
        }, 300); // Duration of fade-out animation
    }

    hideWithoutAnimation() {
        this.style.display = 'none';
        const toast = this.shadowRoot.querySelector('#toast');
        toast.textContent = '';
        toast.className = '';
    }
}

window.customElements.define('toast-message', Toast);