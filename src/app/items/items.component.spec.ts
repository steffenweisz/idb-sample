import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ItemsComponent } from "./items.component";
import { IndexedDBService } from "../services/indexeddb.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

describe("ItemsComponent", () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let indexedDBServiceSpy: jasmine.SpyObj<IndexedDBService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("IndexedDBService", [
      "addItem",
      "getItem",
      "getAllItems",
      "deleteItem",
    ]);

    await TestBed.configureTestingModule({
      imports: [ItemsComponent, FormsModule, CommonModule],
      providers: [{ provide: IndexedDBService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    indexedDBServiceSpy = TestBed.inject(
      IndexedDBService
    ) as jasmine.SpyObj<IndexedDBService>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load all items on init", fakeAsync(() => {
    const items = [{ id: 1, name: "Test Item" }];
    indexedDBServiceSpy.getAllItems.and.returnValue(Promise.resolve(items));

    fixture.detectChanges(); // ngOnInit() gets called here
    tick(); // Simulate passage of time until all pending asynchronous activities finish

    expect(component.items.length).toBe(1);
    expect(component.items).toEqual(items);
  }));

  it("should add a new item", fakeAsync(() => {
    const newItem = { id: 2, name: "New Item" };
    component.newItem = newItem.name;
    indexedDBServiceSpy.addItem.and.returnValue(Promise.resolve(newItem.id));
    indexedDBServiceSpy.getAllItems.and.returnValue(Promise.resolve([newItem]));

    component.addItem();
    tick(); // Wait for addItem to complete
    fixture.detectChanges(); // Trigger change detection
    tick(); // Wait for loadAllItems to complete

    expect(indexedDBServiceSpy.addItem.calls.count()).toBe(1);
    expect(indexedDBServiceSpy.getAllItems.calls.count()).toBe(2); // One in ngOnInit and one after addItem
    expect(component.items.length).toBe(1);
    expect(component.items[0]).toEqual(newItem);
  }));

  it("should fetch an item by id", fakeAsync(() => {
    const fetchedItem = { id: 3, name: "Fetched Item" };
    indexedDBServiceSpy.getItem.and.returnValue(Promise.resolve(fetchedItem));

    component.getItem(fetchedItem.id);
    tick(); // Wait for getItem to complete

    expect(component.fetchedItem).toEqual(fetchedItem);
  }));

  it("should delete an item by id", fakeAsync(() => {
    const itemId = 4;
    const remainingItems = [{ id: 5, name: "Remaining Item" }];
    indexedDBServiceSpy.deleteItem.and.returnValue(Promise.resolve());
    indexedDBServiceSpy.getAllItems.and.returnValue(
      Promise.resolve(remainingItems)
    );

    component.deleteItem(itemId);
    tick(); // Wait for deleteItem to complete
    fixture.detectChanges(); // Trigger change detection
    tick(); // Wait for loadAllItems to complete

    expect(indexedDBServiceSpy.deleteItem.calls.count()).toBe(1);
    expect(indexedDBServiceSpy.getAllItems.calls.count()).toBe(2); // One in ngOnInit and one after deleteItem
    expect(component.items.length).toBe(1);
    expect(component.items).toEqual(remainingItems);
  }));
});
