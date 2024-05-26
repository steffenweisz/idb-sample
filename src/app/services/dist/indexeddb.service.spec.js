"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var indexeddb_service_1 = require("./indexeddb.service");
describe("IndexedDBService", function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(indexeddb_service_1.IndexedDBService);
        // Create the database before each test
        return service["dbReady"];
    });
    afterEach(function (done) {
        // Clear the database after each test
        service["getDB"]().then(function (db) {
            var transaction = db.transaction(["items"], "readwrite");
            var store = transaction.objectStore("items");
            var clearRequest = store.clear();
            clearRequest.onsuccess = function () {
                done();
            };
            clearRequest.onerror = function () {
                done.fail("Failed to clear the database");
            };
        });
    });
    it("should add an item", function (done) {
        var item = { name: "Test Item" };
        service
            .addItem(item)
            .then(function (id) {
            expect(id).toBeGreaterThan(0);
            done();
        })["catch"](done.fail);
    });
    it("should get an item by id", function (done) {
        var item = { name: "Test Item" };
        service
            .addItem(item)
            .then(function (id) {
            return service.getItem(id);
        })
            .then(function (retrievedItem) {
            expect(retrievedItem.name).toBe("Test Item");
            done();
        })["catch"](done.fail);
    });
    it("should get all items", function (done) {
        var items = [{ name: "Item 1" }, { name: "Item 2" }];
        Promise.all(items.map(function (item) { return service.addItem(item); }))
            .then(function () {
            return service.getAllItems();
        })
            .then(function (retrievedItems) {
            expect(retrievedItems.length).toBe(2);
            expect(retrievedItems[0].name).toBe("Item 1");
            expect(retrievedItems[1].name).toBe("Item 2");
            done();
        })["catch"](done.fail);
    });
    it("should delete an item", function (done) {
        var item = { name: "Test Item" };
        service
            .addItem(item)
            .then(function (id) {
            return service.deleteItem(id).then(function () { return id; });
        })
            .then(function (id) {
            return service.getItem(id);
        })
            .then(function (retrievedItem) {
            expect(retrievedItem).toBeUndefined();
            done();
        })["catch"](done.fail);
    });
});
