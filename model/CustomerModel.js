import { customer_db, settings_db } from '../db/db.js';

// -------------------- Customer Class ------------------------
class Customer {
    #id;
    #name;
    #phone;
    #email;
    #points;
    #orders;

    constructor(id, name, phone, email, points, orders) {
        this.#id     = id;
        this.#name   = name;
        this.#phone  = phone;
        this.#email  = email;
        this.#points = points;
        this.#orders = orders;
    }

    get id()     { return this.#id; }
    get name()   { return this.#name; }
    get phone()  { return this.#phone; }
    get email()  { return this.#email; }
    get points() { return this.#points; }
    get orders() { return this.#orders; }

    set id(v)     { this.#id = v; }
    set name(v)   { this.#name = v; }
    set phone(v)  { this.#phone = v; }
    set email(v)  { this.#email = v; }
    set points(v) { this.#points = v; }
    set orders(v) { this.#orders = v; }
}

// ✅ Generate next ID dynamically from existing DB
const getNextId = () =>
    customer_db.length ? Math.max(...customer_db.map(c => c.id)) + 1 : 1;

// --------------------------- Add Customer ---------------------------
const addCustomerData = (cname, cphone, cemail) => {
    let new_customer = new Customer(getNextId(), cname, cphone, cemail, 0, 0);
    customer_db.push(new_customer);
};

// --------------------------- Update Customer ---------------------------
const updateCustomerData = (cid, cname, cphone, cemail) => {
    let obj = customer_db.find(item => item.id === cid);
    if (obj) {
        obj.name  = cname;
        obj.phone = cphone;
        obj.email = cemail;
    }
};

// --------------------------- Delete Customer ---------------------------
const deleteCustomerData = (cid) => {
    let index = customer_db.findIndex(item => item.id === cid);
    if (index !== -1) {
        customer_db.splice(index, 1);
    }
};

// --------------------------- Get All Customers ---------------------------
const getCustomerData = () => customer_db;

// --------------------------- Get Customer by Index ---------------------------
const getCustomerDataByIndex = (index) => customer_db[index];

// --------------------------- Get Customer by Id ---------------------------
const getCustomerDataById = (cid) => customer_db.find(item => item.id === cid);

// --------------------------- Search Customers ---------------------------
const searchCustomerData = (query) => {
    let q = query.toLowerCase();
    return customer_db.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.phone.includes(q)              ||
        item.email.toLowerCase().includes(q)
    );
};

// --------------------------- Add Loyalty Points ---------------------------
const addCustomerPoints = (cid, orderTotal) => {
    let obj = customer_db.find(item => item.id === cid);
    if (obj) {
        obj.points += Math.floor(orderTotal / 100) * settings_db.loyaltyPoints;
        obj.orders += 1;
    }
};

export { addCustomerData, updateCustomerData, deleteCustomerData, getCustomerData,
    getCustomerDataByIndex, getCustomerDataById, searchCustomerData, addCustomerPoints };