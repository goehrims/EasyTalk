 class MessageDisplay extends HTMLElement {
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
                padding: 10px;
                height: calc(100% - 22px);
                align-items: center;
                display: flex;
                flex-direction: column;
            }
            .btn {
                height: max-content;
                background: beige;
                padding: 0.5em 2em;
                border-radius: 8px;
                width: 42%;
                text-align: center;
                font-size: xx-large;
                position: absolute;
                bottom: 1%;
                box-shadow: 0px 0px 2em 0px #00000085;
            }
            .author {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .date {
                font-size: 0.8em;
                color: #666;
                margin-bottom: 5px;
            }
            .content {
                white-space: pre-wrap;
                background: aliceblue;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border-radius: 20px;
                font-size: -webkit-xxx-large;
                min-height: 50%;
                min-width: 80%;
                text-align: center;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                height: -webkit-fill-available;
            }
            .d-flex {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: -webkit-fill-available;
                font-size: xx-large;
                padding: 0.1vh;
            }
            .content img {
                max-width: 80%;
                max-height:95%;
                margin: auto;
            }
            .content p {
                margin: auto;
                background: #ffffff8f;
                padding: 0.5em 1em;
                border-radius: 10px;
                max-width: 80%;
            }
            video {
                width: -webkit-fill-available;
                max-height:100%;
                max-width: 100%;
            }
            </style>
            <div class="message">
                <div class='d-flex'>
                  <div class="author">Autor:</div>
                  <div class="date">Datum:</div>
                </div>
                <div class="content">Nachricht:</div>
                <div class="replybutton btn">Antworten</div>
            </div>
            `;

         // Clone the template and attach to shadow DOM
         this.shadowRoot.appendChild(template.content.cloneNode(true));
     }



     // Define properties for author, date, and content
     static get observedAttributes() {
         return ['author', 'date', 'content', 'messageID', 'parameters'];
     }

     attributeChangedCallback(name, oldValue, newValue) {
         if (oldValue !== newValue) {
             //this.render();
         }
     }

     connectedCallback() {
         var button = this.shadowRoot.querySelector('.replybutton');
         button.addEventListener('click', () => {
             if (typeof this.replyToMessage === 'function') {
                 this.replyToMessage(this.getAttribute('messageID'));
             } else {
                 console.warn("reply is not a function");
             }
         });
         //this.render();
     }

     set replyToMessage(func) {
         this._replyToMessage = func;
     }

     get replyToMessage() {
         return this._replyToMessage;
     }

     async render() {
         const authorElement = this.shadowRoot.querySelector('.author');
         const dateElement = this.shadowRoot.querySelector('.date');
         const contentElement = this.shadowRoot.querySelector('.content');
         contentElement.innerHTML = '';
         let parameters = {};

         if (this.hasAttribute('parameters')) {
             parameters = JSON.parse(this.getAttribute('parameters'));
         } else {
             parameters = {};
         }
         if (this.hasAttribute('author')) {
             authorElement.textContent = this.getAttribute('author');
         }
         if (this.hasAttribute('date')) {
             const date = new Date(this.getAttribute('date') * 1000);
             let dateString = date.toLocaleDateString() + " " + date.getUTCHours() + ":" + date.getMinutes();
             dateElement.textContent = dateString;
         }
         if (this.hasAttribute('content')) {
             let contentShow = false;
             if (this.getAttribute('content') !== '{file}') {
                 contentElement.innerHTML = '<p>' + this.getAttribute('content') + '</p>';
                 contentShow = true;
             } else {
                 contentElement.innerHTML = '';
             }
             if (parameters.file) {
                 contentShow = this.loadMediaContent(parameters.file, contentShow);
             } else {
                 contentElement.style.backgroundImage = 'unset';
             }
             if (!contentShow) {
                 contentElement.textContent = 'Fehler! Nachricht konnte nicht geladen werden.';
             }
         }
     }

     loadMediaContent(fileParams, contentShow) {
         const contentElement = this.shadowRoot.querySelector('.content');
         if (fileParams.mimetype.indexOf("image") >= 0) {
             contentElement.style.backgroundImage = 'url("' + location.origin + '/index.php/core/preview?fileId=' + fileParams.id + '&y=' + fileParams.height / 2 + '&x=' + fileParams.width / 2 + '&a=true&etag=' + fileParams.etag + '")';
             contentShow = true;
         } else if (fileParams.mimetype.indexOf("video") >= 0) {
             // login again?
             let videoURL = location.origin + "/remote.php/dav/files/Marius/" + fileParams.path;
             fetch(videoURL, {
                     headers: {
                         'Authorization': `Bearer ${accessToken}`
                     }
                 })
                 .then(response => {
                     if (response.ok) {
                         // File retrieval successful, you can handle the response here
                         console.log('File retrieved successfully');
                         return response.blob();
                     } else {
                         throw new Error('File retrieval failed');
                     }
                 })
                 .then(blob => {
                     // Create a URL for the Blob object
                     const videoObjectURL = URL.createObjectURL(blob);
                     // Create video element and set its source
                     const videoElement = document.createElement('video');
                     videoElement.src = videoObjectURL;
                     videoElement.autoplay = true;
                     videoElement.controls = true;
                     contentElement.appendChild(videoElement);
                 })
                 .catch(error => {
                     console.error('Error retrieving file:', error);
                 });
             contentShow = true;


         } else {
             contentElement.style.backgroundImage = 'unset';
         }
         return contentShow;
     }
 }

 // Define the custom element
 window.customElements.define('message-display', MessageDisplay);
