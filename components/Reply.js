class MessageReply extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        this.attachShadow({
            mode: 'open'
        });

        // Define a template
        const template = document.createElement('template');
        template.innerHTML = `
          <style>
            .messagecontainer {
              position: absolute;
              top: 0;
              left: 0;
              background: #0000007d;
              width: 100vw;
              height: 100vh;
              align-items: center;
              display: flex;
              flex-direction: column;
            }
            .d-flex {
              display: flex;
              justify-content: space-between;
            }
            .btn {
              margin-top: 1em;
              width: min-content;
              background: beige;
              padding: 0.5em 2em;
              border-radius: 8px;
              text-align: center;
              font-size: xx-large;
              box-shadow: 0px 0px 2em 0px #00000085;
            }
            .textarea{
                background: whitesmoke;
                padding: 1vh 1vw;
                border-radius: 20px;
                margin: auto;
                font-size: xx-large;
                min-width: 90%;
            }
            textarea {
                margin-top: 1em;
                //width: 100%;
                height: 10vh;
                border: none;
                border-radius: 10px;
                font-size: xx-large;
            }
          </style>
          <div class="messagecontainer">
<div class="textarea">
            <div class='d-flex'>
              <div class="content">Deine Nachricht:</div>
              <div class="closebutton btn">Abbrechen</div>
            </div>
            <div class="content">
              <textarea id="replycontent"></textarea>
            </div>
            <div class="sendbutton btn">Senden</div>
</div>
          </div>
        `;

        // Clone the template and attach to shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Define properties for author, date, and content
    static get observedAttributes() {
        return ['messageID'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    close() {
        this.remove();
    }

    connectedCallback() {
        var button = this.shadowRoot.querySelector('.sendbutton');
        button.addEventListener('click', () => {
            if (typeof this.sendMessage === 'function') {
                this.sendMessage(this.shadowRoot.querySelector('textarea').value, this.getAttribute('messageID'));
                this.remove();
            } else {
                console.warn("reply is not a function");
            }
        });
        var closebutton = this.shadowRoot.querySelector('.closebutton');
        closebutton.addEventListener('click', () => {
            this.close();
        });
        var textarea = this.shadowRoot.querySelector('textarea');
        textarea.addEventListener('blur', () => {
            textarea.focus();
        });
        this.render();
    }

    set sendMessage(func) {
        this._sendMessage = func;
    }

    get sendMessage() {
        return this._sendMessage;
    }

    render() {
        var textarea = this.shadowRoot.querySelector('textarea');
        textarea.focus();
    }

}

// Define the custom element
window.customElements.define('reply-message', MessageReply);
