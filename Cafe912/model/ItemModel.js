import { item_db, settings_db } from '../db/db.js';

// -------------------- MenuItem Class ------------------------
class MenuItem {
    #id;
    #name;
    #price;
    #category;
    #active;

    constructor(id, name, price, category, active) {
        this.#id       = id;
        this.#name     = name;
        this.#price    = price;
        this.#category = category;
        this.#active   = active;
    }

    get id()       { return this.#id; }
    get name()     { return this.#name; }
    get price()    { return this.#price; }
    get category() { return this.#category; }
    get active()   { return this.#active; }

    set id(v)       { this.#id = v; }
    set name(v)     { this.#name = v; }
    set price(v)    { this.#price = v; }
    set category(v) { this.#category = v; }
    set active(v)   { this.#active = v; }
}

// ✅ Generate next ID dynamically
const getNextId = () =>
    item_db.length ? Math.max(...item_db.map(i => i.id)) + 1 : 1;

// --------------------------- Add Item ---------------------------
const addItemData = (iname, iprice, icategory) => {
    let new_item = new MenuItem(getNextId(), iname, iprice, icategory, true);
    item_db.push(new_item);
};

// --------------------------- Update Item ---------------------------
const updateItemData = (iid, iname, iprice, icategory) => {
    let obj = item_db.find(item => item.id === iid);
    if (obj) {
        obj.name     = iname;
        obj.price    = iprice;
        obj.category = icategory;
    }
};

// --------------------------- Delete Item (soft delete) ---------------------------
const deleteItemData = (iid) => {
    let obj = item_db.find(item => item.id === iid);
    if (obj) obj.active = false;
};

// --------------------------- Get All Active Items ---------------------------
const getItemData = () => item_db.filter(item => item.active);

// --------------------------- Get Item by Id ---------------------------
const getItemDataById = (iid) => item_db.find(item => item.id === iid);

// --------------------------- Get Items by Category ---------------------------
const getItemDataByCategory = (category) => {
    if (category === 'All') return item_db.filter(item => item.active);
    return item_db.filter(item => item.active && item.category === category);
};

// --------------------------- Search Items ---------------------------
const searchItemData = (query) => {
    let q = query.toLowerCase();
    return item_db.filter(item =>
        item.active && item.name.toLowerCase().includes(q)
    );
};

export { addItemData, updateItemData, deleteItemData, getItemData,
    getItemDataById, getItemDataByCategory, searchItemData };