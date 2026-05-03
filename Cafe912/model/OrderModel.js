import { order_db, settings_db } from '../db/db.js';
import * as DB from '../db/db.js';
import { addCustomerPoints } from './CustomerModel.js';

// -------------------- Order Class ---------------------------
class Order {
    #id;
    #customerId;
    #type;
    #items;
    #status;
    #date;
    #total;

    constructor(id, customerId, type, items, status, date, total) {
        this.#id         = id;
        this.#customerId = customerId;
        this.#type       = type;
        this.#items      = items;
        this.#status     = status;
        this.#date       = date;
        this.#total      = total;
    }

    get id()         { return this.#id; }
    get customerId() { return this.#customerId; }
    get type()       { return this.#type; }
    get items()      { return this.#items; }
    get status()     { return this.#status; }
    get date()       { return this.#date; }
    get total()      { return this.#total; }

    set id(v)         { this.#id = v; }
    set customerId(v) { this.#customerId = v; }
    set type(v)       { this.#type = v; }
    set items(v)      { this.#items = v; }
    set status(v)     { this.#status = v; }
    set date(v)       { this.#date = v; }
    set total(v)      { this.#total = v; }
}

// --------------------------- Add Order (Create) ---------------------------
const addOrderData = (ocustomerId, otype, oitems) => {
    let sub   = oitems.reduce((s, i) => s + i.price * i.qty, 0);
    let svc   = Math.round(sub * (settings_db.serviceCharge / 100));
    let total = sub + svc;
    let id    = 'ORD-' + String(DB.next_order_id++).padStart(3, '0');
    let date  = new Date().toISOString().slice(0, 16).replace('T', ' ');

    let new_order = new Order(id, ocustomerId || null, otype, oitems, 'completed', date, total);
    order_db.push(new_order);

    // Give loyalty points to the customer
    if (ocustomerId) addCustomerPoints(ocustomerId, total);

    return new_order;
};

// --------------------------- Get All Orders ---------------------------
const getOrderData = () => {
    return [...order_db].reverse();
};

// --------------------------- Get Order by Id ---------------------------
const getOrderDataById = (oid) => {
    return order_db.find(item => item.id === oid);
};

// --------------------------- Get Recent N Orders ---------------------------
const getRecentOrderData = (n) => {
    return [...order_db].slice(-n).reverse();
};

// --------------------------- Get Today's Orders ---------------------------
const getTodayOrderData = () => {
    let today = new Date().toISOString().slice(0, 10);
    return order_db.filter(item => item.date.startsWith(today) && item.status === 'completed');
};

// --------------------------- Search Orders ---------------------------
const searchOrderData = (query, getCustomerDataById) => {
    let q = query.toLowerCase();
    return [...order_db].filter(item => {
        let custName = item.customerId ? (getCustomerDataById(item.customerId)?.name || '') : '';
        return item.id.toLowerCase().includes(q) || custName.toLowerCase().includes(q);
    }).reverse();
};

// --------------------------- Calculate Totals ---------------------------
const calculateOrderTotal = (items) => {
    let sub   = items.reduce((s, i) => s + i.price * i.qty, 0);
    let svc   = Math.round(sub * (settings_db.serviceCharge / 100));
    return { sub, svc, total: sub + svc };
};

export { addOrderData, getOrderData, getOrderDataById, getRecentOrderData, getTodayOrderData, searchOrderData, calculateOrderTotal };