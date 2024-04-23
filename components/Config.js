 class ConfigDialog extends HTMLElement {
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
                .message {
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 50%;
                    background: #e3e3e3;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    padding: 2em 4em;
                    border-radius: 20px;
                    box-shadow: 0px 0px 80px 0px #00000061;
                }
                .btn {
                    height: max-content;
                    background: beige;
                    padding: 0.5em 2em;
                    border-radius: 8px;
                    width: 42%;
                    text-align: center;
                    font-size: large;
                    border: none;
                    margin-top: 1em;
                    box-shadow: 0px 0px 2em 0px #00000029;
                }
                .d-flex label {
                    margin-right: 1em;
                }
                .d-flex input {
                    border: none;
                    border-radius: 8px;
                    font-size: xx-large;
                }
                .d-flex {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: -webkit-fill-available;
                    font-size: xx-large;
                    padding: 0.1vh;
                    margin: 0.1em 0em;
                }
            </style>
            <div class="message">
                <div class='d-flex'>
                    <label for='webdav'>Webdav</label>
                    <input type='text' name='webdav'>
                </div>
                <div class='d-flex'>
                    <label for='username'>Username</label>
                    <input type='text' name='username'>
                </div>
                <div class='d-flex'>
                    <label for='password'>Passwort</label>
                    <input type='password' name='password'>
                </div>
                <div class='d-flex'>
                    <label for='chat'>chat token</label>
                    <input type='text' name='chat'>
                </div>
                <button class='saveButton btn'>Speichern</button>
            </div>
        `;

         // Clone the template and attach to shadow DOM
         this.shadowRoot.appendChild(template.content.cloneNode(true));
     }

     

     // Define properties for author, date, and content
     static get observedAttributes() {
         return [];
     }

     connectedCallback() {
         this.shadowRoot.querySelector('input[name="username"]').focus();
         var button = this.shadowRoot.querySelector('.saveButton');
         button.addEventListener('click', () => {
             if (typeof this.saveConfig === 'function') {
                 this.saveConfig({"username": this.shadowRoot.querySelector('input[name="username"]').value,"password": this.shadowRoot.querySelector('input[name="password"]').value,"webdav": this.shadowRoot.querySelector('input[name="webdav"]').value, "chatToken": this.shadowRoot.querySelector('input[name="chat"]').value});
                 this.remove();
             } else {
                 console.warn("reply is not a function");
             }
         });
     }

     set saveConfig(func) {
         this._saveConfig = func;
     }

     get saveConfig() {
         return this._saveConfig;
     }
 }

 // Define the custom element
 window.customElements.define('config-dialog', ConfigDialog);
