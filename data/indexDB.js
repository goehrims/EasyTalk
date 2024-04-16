function readData(callback) {
    const request = indexedDB.open('seniorTalkData', 1);

	request.onupgradeneeded = createDatabase;
    request.onerror = function(event) {
        console.log('Database error: ' + event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Check if data exists in the database
        const transaction = db.transaction(['credentials'], 'readonly');
        const objectStore = transaction.objectStore('credentials');
        const getRequest = objectStore.getAll();

        getRequest.onsuccess = function(event) {
            const storedData = event.target.result;
            callback(null, storedData);
        };
    };
}

function createDatabase(event) {
    const db = event.target.result;

    // Create an object store
    const objectStore = db.createObjectStore('credentials', { keyPath: 'id', autoIncrement: true });

    // Add an index
    objectStore.createIndex('accessToken', 'accessToken', { unique: false });
    objectStore.createIndex('chatToken', 'chatToken', { unique: false });
}

// Function to add data to the database
function addData(accessToken, chatToken) {
    const request = indexedDB.open('seniorTalkData', 1);
    
	request.onupgradeneeded = createDatabase;
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['credentials'], 'readwrite');
        const objectStore = transaction.objectStore('credentials');
        const addRequest = objectStore.add({ accessToken, chatToken });

        addRequest.onsuccess = function() {
            console.log('Data added successfully');
        };

        addRequest.onerror = function() {
            console.error('Error adding data');
        };
    };
}

function clearData(callback) {
    const request = indexedDB.open('seniorTalkData', 1);

    request.onerror = function(event) {
        console.log('Database error: ' + event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Open a transaction with write access
        const transaction = db.transaction(['credentials'], 'readwrite');

        // Access the object store
        const objectStore = transaction.objectStore('credentials');

        // Clear the object store
        const clearRequest = objectStore.clear();

        clearRequest.onsuccess = function(event) {
            console.log('Data cleared successfully');
            if (callback) {
                callback(null);
            }
        };

        clearRequest.onerror = function(event) {
            console.error('Error clearing data:', event.target.error);
            if (callback) {
                callback(event.target.error);
            }
        };
    };
}
