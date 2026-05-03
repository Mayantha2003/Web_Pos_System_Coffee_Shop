
import { addCustomerData, updateCustomerData, deleteCustomerData,
    getCustomerData, getCustomerDataByIndex, getCustomerDataById,
    searchCustomerData } from '../model/CustomerModel.js';

import { check_name, check_phone, check_email } from '../utils/validation.js';

// --------------------------- Load Customer Table (Read) ---------------------------
const loadCustomerTbl = () => {
    $('#cust-table').empty();
    let customers = getCustomerData();

    if (!customers.length) {
        $('#cust-table').append(`<tr><td colspan="6" class="text-center p-4" style="color:#7a5830;">No customers found.</td></tr>`);
        return;
    }

    customers.map((item, index) => {
        let new_row = `
        <tr data-index="${index}">
            <td class="nm">${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td class="hi">${item.points} pts</td>
            <td>${item.orders}</td>
            <td>
                <button class="ab ab-ed cust-edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i> Edit</button>
                <button class="ab ab-dl cust-delete-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
        $('#cust-table').append(new_row);
    });
};

// --------------------------- Populate Customer Select (Sale page) ---------------------------
const populateCustomerSelect = () => {
    $('#order-customer').empty().append('<option value="">— Walk-in / No Account —</option>');
    getCustomerData().map(c => {
        $('#order-customer').append(`<option value="${c.id}">${c.name} (${c.phone})</option>`);
    });
};

// --------------------------- Clean Customer Form ---------------------------
const cleanCustomerForm = () => {
    $('#fc-name').val('');
    $('#fc-phone').val('');
    $('#fc-email').val('');
};

// ========================= ADD CUSTOMER =========================
$('#add-cust-btn').on('click', function () {
    Swal.fire({
        title: 'Add Customer',
        background: '#1a110a',
        color: '#f5e8d8',
        html: `
            <div style="text-align:left">
                <label class="flbl">Full Name *</label>
                <input id="fc-name" class="finput w-100 mb-2" placeholder="e.g. Kasun Perera">
                <div id="fc-name-err" class="ferr">Name must be 2–60 letters.</div>

                <label class="flbl">Phone *</label>
                <input id="fc-phone" class="finput w-100 mb-2" placeholder="0771234567">
                <div id="fc-phone-err" class="ferr">Phone must be 10 digits starting with 0.</div>

                <label class="flbl">Email *</label>
                <input id="fc-email" class="finput w-100 mb-2" type="email" placeholder="name@email.com">
                <div id="fc-email-err" class="ferr">Enter a valid email address.</div>
            </div>`,
        confirmButtonText: 'Add Customer',
        confirmButtonColor: '#E8611A',
        showCancelButton: true,
        cancelButtonColor: '#3d2010',
        preConfirm: () => {
            let name  = $('#fc-name').val().trim();
            let phone = $('#fc-phone').val().trim();
            let email = $('#fc-email').val().trim();
            let valid = true;

            // --- Validate using Validation.js ---
            (!check_name(name))
                ? ($('#fc-name').addClass('is-invalid'), $('#fc-name-err').addClass('show'), valid = false)
                : ($('#fc-name').removeClass('is-invalid'), $('#fc-name-err').removeClass('show'));

            (!check_phone(phone))
                ? ($('#fc-phone').addClass('is-invalid'), $('#fc-phone-err').addClass('show'), valid = false)
                : ($('#fc-phone').removeClass('is-invalid'), $('#fc-phone-err').removeClass('show'));

            (!check_email(email))
                ? ($('#fc-email').addClass('is-invalid'), $('#fc-email-err').addClass('show'), valid = false)
                : ($('#fc-email').removeClass('is-invalid'), $('#fc-email-err').removeClass('show'));

            if (!valid) { Swal.showValidationMessage('Please fix the errors above.'); return false; }
            return { name, phone, email };
        }
    }).then(result => {
        if (result.isConfirmed) {
            // --- Pass to CustomerModel → writes to DB ---
            addCustomerData(result.value.name, result.value.phone, result.value.email);
            loadCustomerTbl();
            populateCustomerSelect();
            Swal.fire({ icon: 'success', title: 'Customer added!', background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
        }
    });
});

// ========================= CLICK ROW → FILL FORM =========================
$('#cust-table').on('click', 'tr', function () {
    let obj = getCustomerDataByIndex($(this).index());
    if (!obj) return;
    // Store selected id for update/delete
    $('#selected-cust-id').val(obj.id);
});

// ========================= EDIT CUSTOMER =========================
$(document).on('click', '.cust-edit-btn', function (e) {
    e.stopPropagation();
    let id  = parseInt($(this).data('id'));
    let obj = getCustomerDataById(id);
    if (!obj) return;

    Swal.fire({
        title: 'Edit Customer',
        background: '#1a110a',
        color: '#f5e8d8',
        html: `
            <div style="text-align:left">
                <label class="flbl">Full Name *</label>
                <input id="fc-name" class="finput w-100 mb-2" value="${obj.name}">
                <div id="fc-name-err" class="ferr">Name must be 2–60 letters.</div>

                <label class="flbl">Phone *</label>
                <input id="fc-phone" class="finput w-100 mb-2" value="${obj.phone}">
                <div id="fc-phone-err" class="ferr">Phone must be 10 digits starting with 0.</div>

                <label class="flbl">Email *</label>
                <input id="fc-email" class="finput w-100 mb-2" value="${obj.email}">
                <div id="fc-email-err" class="ferr">Enter a valid email address.</div>
            </div>`,
        confirmButtonText: 'Save Changes',
        confirmButtonColor: '#E8611A',
        showCancelButton: true,
        cancelButtonColor: '#3d2010',
        preConfirm: () => {
            let name  = $('#fc-name').val().trim();
            let phone = $('#fc-phone').val().trim();
            let email = $('#fc-email').val().trim();
            let valid = true;

            (!check_name(name))
                ? ($('#fc-name').addClass('is-invalid'), $('#fc-name-err').addClass('show'), valid = false)
                : ($('#fc-name').removeClass('is-invalid'), $('#fc-name-err').removeClass('show'));

            (!check_phone(phone))
                ? ($('#fc-phone').addClass('is-invalid'), $('#fc-phone-err').addClass('show'), valid = false)
                : ($('#fc-phone').removeClass('is-invalid'), $('#fc-phone-err').removeClass('show'));

            (!check_email(email))
                ? ($('#fc-email').addClass('is-invalid'), $('#fc-email-err').addClass('show'), valid = false)
                : ($('#fc-email').removeClass('is-invalid'), $('#fc-email-err').removeClass('show'));

            if (!valid) { Swal.showValidationMessage('Please fix the errors above.'); return false; }
            return { name, phone, email };
        }
    }).then(result => {
        if (result.isConfirmed) {
            // --- Pass to CustomerModel → updates DB ---
            updateCustomerData(id, result.value.name, result.value.phone, result.value.email);
            loadCustomerTbl();
            populateCustomerSelect();
            Swal.fire({ icon: 'success', title: 'Customer updated!', background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
        }
    });
});

// ========================= DELETE CUSTOMER =========================
$(document).on('click', '.cust-delete-btn', function (e) {
    e.stopPropagation();
    let id  = parseInt($(this).data('id'));
    let obj = getCustomerDataById(id);
    if (!obj) return;

    Swal.fire({
        title: 'Are you sure?',
        text: `Remove customer "${obj.name}"?`,
        icon: 'warning',
        background: '#1a110a',
        color: '#f5e8d8',
        showCancelButton: true,
        confirmButtonColor: '#5c1a1a',
        cancelButtonColor: '#3d2010',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            // --- Pass to CustomerModel → deletes from DB ---
            deleteCustomerData(id);
            loadCustomerTbl();
            populateCustomerSelect();
            Swal.fire({ icon: 'success', title: 'Customer deleted!', background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
        }
    });
});

// ========================= SEARCH CUSTOMERS =========================
$('#cust-search').on('input', function () {
    let q = $(this).val().trim();
    $('#cust-table').empty();

    let results = q ? searchCustomerData(q) : getCustomerData();

    if (!results.length) {
        $('#cust-table').append(`<tr><td colspan="6" class="text-center p-4" style="color:#7a5830;">No customers found.</td></tr>`);
        return;
    }

    results.map((item, index) => {
        $('#cust-table').append(`
            <tr data-index="${index}">
                <td class="nm">${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.email}</td>
                <td class="hi">${item.points} pts</td>
                <td>${item.orders}</td>
                <td>
                    <button class="ab ab-ed cust-edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="ab ab-dl cust-delete-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`);
    });
});

// --------------------------- Initial Load ---------------------------
loadCustomerTbl();
populateCustomerSelect();

export { loadCustomerTbl, populateCustomerSelect };