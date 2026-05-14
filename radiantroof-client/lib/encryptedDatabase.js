// lib/encryptedDatabase.js
// Offline Encrypted Database using IndexedDB and Web Crypto API

class EncryptedDatabase {
  constructor(dbName = 'radiantroof-db', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.key = null;
  }

  // Initialize the database
  async init(password) {
    // Derive encryption key from password
    this.key = await this.deriveKey(password);

    // Open IndexedDB
    this.db = await this.openDB();
  }

  // Derive encryption key from password using PBKDF2
  async deriveKey(password) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('radiantroof-salt'), // Use a proper salt in production
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Open IndexedDB
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('properties')) {
          db.createObjectStore('properties', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('deals')) {
          db.createObjectStore('deals', { keyPath: 'id' });
        }
      };
    });
  }

  // Encrypt data
  async encrypt(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.key,
      dataBuffer
    );

    return { encrypted: new Uint8Array(encrypted), iv };
  }

  // Decrypt data
  async decrypt(encryptedData, iv) {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      this.key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  }

  // Store encrypted data
  async store(storeName, data) {
    const { encrypted, iv } = await this.encrypt(data);
    const encryptedItem = { id: data.id, data: encrypted, iv };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(encryptedItem);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Retrieve and decrypt data
  async retrieve(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          this.decrypt(request.result.data, request.result.iv)
            .then(resolve)
            .catch(reject);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get all items from a store
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = [];
        for (const item of request.result) {
          results.push(this.decrypt(item.data, item.iv));
        }
        Promise.all(results).then(resolve).catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Delete data
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Close database
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default EncryptedDatabase;