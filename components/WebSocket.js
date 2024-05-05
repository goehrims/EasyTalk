var socket = new WebSocket('ws://' + location.hostname + ':8513');

socket.onopen = function() {
    console.log('WebSocket connection established.');
};

socket.onmessage = function(event) {
    var message = event.data;
    if (message == 'Reload chat:' + chatToken) {
        reloadPage();
    }
    console.log('Received message from server:', message);
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
    // Handle error as needed...
    reloadPage();
};

socket.onclose = function(event) {
    console.log('WebSocket connection closed.');
    reloadPage();
};
