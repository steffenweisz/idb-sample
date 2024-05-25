// src/app/items.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IndexedDBService } from "../services/indexeddb.service";

@Component({
  selector: "app-items",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>IndexedDB Example</h2>

      <div>
        <input [(ngModel)]="newItem" placeholder="Enter item name" />
        <button (click)="addItem()">Add Item</button>
      </div>

      <div *ngIf="items.length > 0">
        <h3>Saved Items</h3>
        <ul>
          <li *ngFor="let item of items">
            {{ item.name }}
            <button (click)="getItem(item.id)">Get Item</button>
            <button (click)="deleteItem(item.id)">Delete</button>
          </li>
        </ul>
      </div>

      <div *ngIf="fetchedItem">
        <h3>Fetched Item</h3>
        <p>{{ fetchedItem | json }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      div {
        margin: 10px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    `,
  ],
})
export class ItemsComponent implements OnInit {
  newItem: string = "";
  fetchedItem: any = null;
  items: any[] = [];

  constructor(private indexedDBService: IndexedDBService) {}

  ngOnInit(): void {
    this.loadAllItems();
  }

  addItem() {
    this.indexedDBService.addItem({ name: this.newItem }).then((id) => {
      this.loadAllItems();
      console.log("Item added with id:", id);
    });
  }

  getItem(id: number) {
    this.indexedDBService.getItem(id).then((item) => {
      this.fetchedItem = item;
      console.log("Fetched item:", item);
    });
  }

  loadAllItems() {
    this.indexedDBService.getAllItems().then((items) => {
      this.items = items;
      console.log("All items:", items);
    });
  }

  deleteItem(id: number) {
    this.indexedDBService.deleteItem(id).then(() => {
      this.loadAllItems();
      console.log("Item deleted with id:", id);
    });
  }
}
