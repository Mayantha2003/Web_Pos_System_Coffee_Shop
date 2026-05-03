import { item_db } from '../db/db.js';
import * as DB from '../db/db.js';

// -------------------- MenuItem Class ------------------------
class MenuItem {
    #id;
    #name;
    #price;
    #category;
    #emoji;
    #active;

    constructor(id, name, price, category, emoji, active) {
        this.#id       = id;
        this.#name     = name;
        this.#price    = price;
        this.#category = category;
        this.#emoji    = emoji;
        this.#active   = active;
    }

    get id()       { return this.#id; }
    get name()     { return this.#name; }
    get price()    { return this.#price; }
    get category() { return this.#category; }
    get emoji()    { return this.#emoji; }
    get active()   { return this.#active; }

    set id(v)       { this.#id = v; }
    set name(v)     { this.#name = v; }
    set price(v)    { this.#price = v; }
    set category(v) { this.#category = v; }
    set emoji(v)    { this.#emoji = v; }
    set active(v)   { this.#active = v; }
}

// --------------------------- Add Item ---------------------------
const addItemData = (iname, iprice, icategory, iemoji) => {
    let new_item = new MenuItem(DB.next_item_id++, iname, iprice, icategory, iemoji, true);
    item_db.push(new_item);
};

// --------------------------- Update Item ---------------------------
const updateItemData = (iid, iname, iprice, icategory, iemoji) => {
    let obj = item_db.find(item => item.id === iid);
    if (obj) {
        obj.name     = iname;
        obj.price    = iprice;
        obj.category = icategory;
        obj.emoji    = iemoji;
    }
};

// --------------------------- Delete Item (soft delete) ---------------------------
const deleteItemData = (iid) => {
    let obj = item_db.find(item => item.id === iid);
    if (obj) obj.active = false;
};

// --------------------------- Get All Active Items ---------------------------
const getItemData = () => {
    return item_db.filter(item => item.active);
};

// --------------------------- Get Item by Id ---------------------------
const getItemDataById = (iid) => {
    return item_db.find(item => item.id === iid);
};

// --------------------------- Get Items by Category ---------------------------
const getItemDataByCategory = (category) => {
    if (category === 'All') return item_db.filter(item => item.active);
    return item_db.filter(item => item.active && item.category === category);
};

// --------------------------- Search Items ---------------------------
const searchItemData = (query) => {
    let q = query.toLowerCase();
    return item_db.filter(item => item.active && item.name.toLowerCase().includes(q));
};

export { addItemData, updateItemData, deleteItemData, getItemData, getItemDataById, getItemDataByCategory, searchItemData };