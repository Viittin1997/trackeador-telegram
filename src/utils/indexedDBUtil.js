// Utility functions for working with IndexedDB

// Database configuration
const DB_NAME = 'trackeadorTelegramDB';
const DB_VERSION = 1;
const USER_STORE = 'userStore';

// Initialize the database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      console.log('IndexedDB opened successfully');
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create the user store if it doesn't exist
      if (!db.objectStoreNames.contains(USER_STORE)) {
        const store = db.createObjectStore(USER_STORE, { keyPath: 'uu_id' });
        store.createIndex('email', 'email', { unique: true });
        console.log('User store created');
      }
    };
  });
};

// Save user data to IndexedDB
export const saveUserData = async (userData) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readwrite');
      const store = transaction.objectStore(USER_STORE);
      
      const request = store.put(userData);
      
      request.onsuccess = () => {
        console.log('User data saved to IndexedDB');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in saveUserData:', error);
    throw error;
  }
};

// Get user data from IndexedDB
export const getUserData = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readonly');
      const store = transaction.objectStore(USER_STORE);
      
      // Get all records (should only be one)
      const request = store.getAll();
      
      request.onsuccess = () => {
        const userData = request.result[0] || null;
        resolve(userData);
      };
      
      request.onerror = (event) => {
        console.error('Error getting user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in getUserData:', error);
    return null;
  }
};

// Clear user data from IndexedDB (for logout)
export const clearUserData = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USER_STORE], 'readwrite');
      const store = transaction.objectStore(USER_STORE);
      
      // Clear all records
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('User data cleared from IndexedDB');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error clearing user data:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in clearUserData:', error);
    throw error;
  }
};
