import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IndexedDBService {
  private dbName = "MyDatabase";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private dbReady: Promise<IDBDatabase>;

  constructor() {
    this.dbReady = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error("Database error:", event);
        reject("Database error");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log("Database opened successfully");
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("items")) {
          db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
        }
      };
    });
  }

  private getDB(): Promise<IDBDatabase> {
    return this.dbReady;
  }

  addItem(item: any): Promise<number> {
    return this.getDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(["items"], "readwrite");
          const store = transaction.objectStore("items");
          const request = store.add(item);

          request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result as number);
          };

          request.onerror = (event) => {
            reject("Error adding item");
          };
        })
    );
  }

  getItem(id: number): Promise<any> {
    return this.getDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(["items"], "readonly");
          const store = transaction.objectStore("items");
          const request = store.get(id);

          request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result);
          };

          request.onerror = (event) => {
            reject("Error getting item");
          };
        })
    );
  }

  getAllItems(): Promise<any[]> {
    return this.getDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(["items"], "readonly");
          const store = transaction.objectStore("items");
          const request = store.getAll();

          request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result);
          };

          request.onerror = (event) => {
            reject("Error getting all items");
          };
        })
    );
  }

  deleteItem(id: number): Promise<void> {
    return this.getDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(["items"], "readwrite");
          const store = transaction.objectStore("items");
          const request = store.delete(id);

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (event) => {
            reject("Error deleting item");
          };
        })
    );
  }
}
