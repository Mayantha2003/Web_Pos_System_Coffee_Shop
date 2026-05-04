// ------------------------ Regex Patterns ---------------------
const name_regex     = new RegExp("^[A-Za-z\\s\\u0080-\\uFFFF]{2,60}$");
const phone_regex    = new RegExp("^0[0-9]{9}$");
const email_regex    = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");
const price_regex    = new RegExp("^\\d{1,6}(\\.\\d{1,2})?$");
const itemName_regex = new RegExp("^[A-Za-z0-9\\s\\-&']{2,50}$");
const username_regex = new RegExp("^[a-z0-9_]{3,20}$");
const password_regex = new RegExp("^.{4,}$");

// ------------------------ Check Functions --------------------
const check_name     = (name)     => { return name_regex.test(name.trim()); };
const check_phone    = (phone)    => { return phone_regex.test(phone.trim()); };
const check_email    = (email)    => { return email_regex.test(email.trim()); };
const check_price    = (price)    => { return price_regex.test(price.toString().trim()); };
const check_itemName = (itemName) => { return itemName_regex.test(itemName.trim()); };
const check_username = (username) => { return username_regex.test(username.trim()); };
const check_password = (password) => { return password_regex.test(password); };

export { check_name, check_phone, check_email, check_price, check_itemName, check_username, check_password };