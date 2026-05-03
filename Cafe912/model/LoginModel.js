import { user_db } from '../db/db.js';

// -------------------- User Class ----------------------------
class User {
    #username;
    #password;
    #name;
    #role;
    #av;

    constructor(username, password, name, role, av) {
        this.#username = username;
        this.#password = password;
        this.#name     = name;
        this.#role     = role;
        this.#av       = av;
    }

    get username() { return this.#username; }
    get password() { return this.#password; }
    get name()     { return this.#name; }
    get role()     { return this.#role; }
    get av()       { return this.#av; }

    set username(v) { this.#username = v; }
    set password(v) { this.#password = v; }
    set name(v)     { this.#name = v; }
    set role(v)     { this.#role = v; }
    set av(v)       { this.#av = v; }
}

// --------------------------- Find User (Login) ---------------------------
const findUserData = (username, password) => {
    return user_db.find(u =>
        u.username === username.toLowerCase().trim() && u.password === password
    ) || null;
};

// --------------------------- Get All Users ---------------------------
const getUserData = () => {
    return user_db;
};

export { findUserData, getUserData };