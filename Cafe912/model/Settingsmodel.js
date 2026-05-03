import { settings_db } from '../db/db.js';

// --------------------------- Get Settings ---------------------------
const getSettingsData = () => {
    return settings_db;
};

// --------------------------- Update Settings ---------------------------
const updateSettingsData = (data) => {
    Object.assign(settings_db, data);
};

export { getSettingsData, updateSettingsData };