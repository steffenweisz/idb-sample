import { TestBed } from "@angular/core/testing";
import { IndexedDBService } from "./indexeddb.service";

describe("IndexedDBService", () => {
  let service: IndexedDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDBService);

    // Create the database before each test
    return service["dbReady"];
  });

  afterEach((done) => {
    // Clear the database after each test
    service["getDB"]().then((db) => {
      const transaction = db.transaction(["items"], "readwrite");
      const store = transaction.objectStore("items");
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        done();
      };

      clearRequest.onerror = () => {
        done.fail("Failed to clear the database");
      };
    });
  });

  it("should add an item", (done) => {
    const item = { name: "Test Item" };

    service
      .addItem(item)
      .then((id) => {
        expect(id).toBeGreaterThan(0);
        done();
      })
      .catch(done.fail);
  });

  it("should get an item by id", (done) => {
    const item = { name: "Test Item" };

    service
      .addItem(item)
      .then((id) => {
        return service.getItem(id);
      })
      .then((retrievedItem) => {
        expect(retrievedItem.name).toBe("Test Item");
        done();
      })
      .catch(done.fail);
  });

  it("should get all items", (done) => {
    const items = [{ name: "Item 1" }, { name: "Item 2" }];

    Promise.all(items.map((item) => service.addItem(item)))
      .then(() => {
        return service.getAllItems();
      })
      .then((retrievedItems) => {
        expect(retrievedItems.length).toBe(2);
        expect(retrievedItems[0].name).toBe("Item 1");
        expect(retrievedItems[1].name).toBe("Item 2");
        done();
      })
      .catch(done.fail);
  });

  it("should delete an item", (done) => {
    const item = { name: "Test Item" };

    service
      .addItem(item)
      .then((id) => {
        return service.deleteItem(id).then(() => id);
      })
      .then((id) => {
        return service.getItem(id);
      })
      .then((retrievedItem) => {
        expect(retrievedItem).toBeUndefined();
        done();
      })
      .catch(done.fail);
  });
});
