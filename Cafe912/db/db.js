// ------------------------ User DB ----------------------------
let user_db = [
    { username: 'admin',   password: 'admin123', name: 'Admin',          role: 'Administrator',          av: 'A'  },
    { username: 'maya',    password: '1234',     name: 'Maya',           role: 'Cashier · CF912/CMB/01', av: 'M'  },
    { username: 'manager', password: 'mgr2024',  name: 'Branch Manager', role: 'Manager · CF912/CMB/01', av: 'BM' },
];

// ------------------------ Menu Item DB -----------------------
let item_db = [
    { id: 1,  name: 'Espresso',       price: 350, category: 'Coffee', active: true },
    { id: 2,  name: 'Cappuccino',     price: 480, category: 'Coffee', active: true },
    { id: 3,  name: 'Latte',          price: 520, category: 'Coffee', active: true },
    { id: 4,  name: 'Flat White',     price: 490, category: 'Coffee', active: true },
    { id: 5,  name: 'Cold Brew',      price: 580, category: 'Cold',   active: true },
    { id: 6,  name: 'Iced Latte',     price: 560, category: 'Cold',   active: true },
    { id: 7,  name: 'Green Tea',      price: 320, category: 'Tea',    active: true },
    { id: 8,  name: 'Masala Chai',    price: 360, category: 'Tea',    active: true },
    { id: 9,  name: 'Croissant',      price: 290, category: 'Food',   active: true },
    { id: 10, name: 'Banana Bread',   price: 350, category: 'Food',   active: true },
    { id: 11, name: 'Club Sandwich',  price: 780, category: 'Food',   active: true },
    { id: 12, name: 'Chocolate Cake', price: 420, category: 'Food',   active: true },
    { id: 13, name: 'Mocha',          price: 540, category: 'Coffee', active: true },
    { id: 14, name: 'Americano',      price: 380, category: 'Coffee', active: true },
    { id: 15, name: 'Mango Smoothie', price: 650, category: 'Cold',   active: true },
];

// ------------------------ Customer DB ------------------------
let customer_db = [
    { id: 1, name: 'Kasun Perera',      phone: '0771234567', email: 'kasun@email.com',  points: 240, orders: 8  },
    { id: 2, name: 'Nimal Silva',       phone: '0712345678', email: 'nimal@email.com',  points: 120, orders: 4  },
    { id: 3, name: 'Sanduni Fernando',  phone: '0763456789', email: 'sand@email.com',   points: 380, orders: 13 },
    { id: 4, name: 'Chamara Wijesinghe',phone: '0754567890', email: 'chama@email.com',  points: 60,  orders: 2  },
    { id: 5, name: 'Dilini Rathnayake', phone: '0745678901', email: 'dilini@email.com', points: 510, orders: 17 },
];

let order_db = [
    { id: 'ORD-001', customerId: 1,    type: 'dine-in',  items: [{name:'Cappuccino',qty:2,price:480},{name:'Croissant',qty:1,price:290}],          status:'completed', date:'2025-05-02 09:14', total:1250 },
    { id: 'ORD-002', customerId: 3,    type: 'takeaway', items: [{name:'Latte',qty:1,price:520},{name:'Banana Bread',qty:2,price:350}],             status:'completed', date:'2025-05-02 09:45', total:1220 },
    { id: 'ORD-003', customerId: null, type: 'dine-in',  items: [{name:'Espresso',qty:1,price:350}],                                               status:'completed', date:'2025-05-02 10:02', total:350  },
    { id: 'ORD-004', customerId: 5,    type: 'dine-in',  items: [{name:'Flat White',qty:1,price:490},{name:'Club Sandwich',qty:1,price:780}],       status:'completed', date:'2025-05-02 10:31', total:1270 },
];

// ------------------------ Settings DB ------------------------
let settings_db = {
    shopName:      'CAFE 912',
    branch:        'Colombo Fort',
    currency:      'LKR',
    serviceCharge: 10,
    taxRate:       0,
    loyaltyPoints: 10,
};

// ------------------------ ID Counters ------------------------
let next_item_id     = 16;
let next_customer_id = 6;
let next_order_id    = 5;

export { user_db, item_db, customer_db, order_db, settings_db, next_item_id, next_customer_id, next_order_id };