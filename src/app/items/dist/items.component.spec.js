"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var items_component_1 = require("./items.component");
var indexeddb_service_1 = require("../services/indexeddb.service");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
describe("ItemsComponent", function () {
    var component;
    var fixture;
    var indexedDBServiceSpy;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jasmine.createSpyObj("IndexedDBService", [
                        "addItem",
                        "getItem",
                        "getAllItems",
                        "deleteItem",
                    ]);
                    return [4 /*yield*/, testing_1.TestBed.configureTestingModule({
                            imports: [items_component_1.ItemsComponent, forms_1.FormsModule, common_1.CommonModule],
                            providers: [{ provide: indexeddb_service_1.IndexedDBService, useValue: spy }]
                        }).compileComponents()];
                case 1:
                    _a.sent();
                    fixture = testing_1.TestBed.createComponent(items_component_1.ItemsComponent);
                    component = fixture.componentInstance;
                    indexedDBServiceSpy = testing_1.TestBed.inject(indexeddb_service_1.IndexedDBService);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should create", function () {
        expect(component).toBeTruthy();
    });
    it("should load all items on init", testing_1.fakeAsync(function () {
        var items = [{ id: 1, name: "Test Item" }];
        indexedDBServiceSpy.getAllItems.and.returnValue(Promise.resolve(items));
        fixture.detectChanges(); // ngOnInit() gets called here
        testing_1.tick(); // Simulate passage of time until all pending asynchronous activities finish
        expect(component.items.length).toBe(1);
        expect(component.items).toEqual(items);
    }));
    it("should add a new item", testing_1.fakeAsync(function () {
        var newItem = { id: 2, name: "New Item" };
        component.newItem = newItem.name;
        indexedDBServiceSpy.addItem.and.returnValue(Promise.resolve(newItem.id));
        indexedDBServiceSpy.getAllItems.and.returnValue(Promise.resolve([newItem]));
        component.addItem();
        testing_1.tick(); // Wait for addItem to complete
        fixture.detectChanges(); // Trigger change detection
        testing_1.tick(); // Wait for loadAllItems to complete
        expect(indexedDBServiceSpy.addItem.calls.count()).toBe(1);
        expect(indexedDBServiceSpy.getAllItems.calls.count()).toBe(2); // One in ngOnInit and one after addItem
        expect(component.items.length).toBe(1);
        expect(component.items[0]).toEqual(newItem);
    }));
    it("should fetch an item by id", testing_1.fakeAsync(function () {
        var fetchedItem = { id: 3, name: "Fetched Item" };
        indexedDBServiceSpy.getItem.and.returnValue(Promise.resolve(fetchedItem));
        component.getItem(fetchedItem.id);
        testing_1.tick(); // Wait for getItem to complete
        expect(component.fetchedItem).toEqual(fetchedItem);
    }));
    it("should delete an item by id", testing_1.fakeAsync(function () {
        var itemId = 4;
        var remainingItems = [{ id: 5, name: "Remaining Item" }];
        indexedDBServiceSpy.deleteItem.and.returnValue(Promise.resolve());
        indexedDBServiceSpy.getAllItems.and.returnValue(Promise.resolve(remainingItems));
        component.deleteItem(itemId);
        testing_1.tick(); // Wait for deleteItem to complete
        fixture.detectChanges(); // Trigger change detection
        testing_1.tick(); // Wait for loadAllItems to complete
        expect(indexedDBServiceSpy.deleteItem.calls.count()).toBe(1);
        expect(indexedDBServiceSpy.getAllItems.calls.count()).toBe(2); // One in ngOnInit and one after deleteItem
        expect(component.items.length).toBe(1);
        expect(component.items).toEqual(remainingItems);
    }));
});
