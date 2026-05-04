import { addCustomerData, updateCustomerData, deleteCustomerData,
    getCustomerData, getCustomerDataByIndex, getCustomerDataById,
    searchCustomerData } from '../model/CustomerModel.js';

import { check_name, check_phone, check_email } from '../utils/validation.js';

// --------------------------- Load Customer Table ---------------------------
const loadCustomerTbl = () => {
    $('#cust-table').empty();
    let customers = getCustomerData();

    if (!customers.length) {
        $('#cust-table').append(`<tr><td colspan="6" class="text-center p-4" style="color:#7a5830;">No customers found.</td></tr>`);
        return;
    }

    customers.forEach((item, index) => {
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
};

// --------------------------- Populate Customer Select ---------------------------
const populateCustomerSelect = () => {
    $('#order-customer').empty().append('<option value="">— Walk-in / No Account —</option>');
    getCustomerData().forEach(c => {
        $('#order-customer').append(`<option value="${c.id}">${c.name} (${c.phone})</option>`);
    });
};

// --------------------------- Shared Validation Logic ---------------------------
const validateCustomerForm = () => {
    let name  = $('#fc-name').val().trim();
    let phone = $('#fc-phone').val().trim();
    let email = $('#fc-email').val().trim();
    let valid = true;

    (!check_name(name))
        ? ($('#fc-name').addClass('is-invalid'),  $('#fc-name-err').addClass('show'),  valid = false)
        : ($('#fc-name').removeClass('is-invalid'),  $('#fc-name-err').removeClass('show'));

    (!check_phone(phone))
        ? ($('#fc-phone').addClass('is-invalid'), $('#fc-phone-err').addClass('show'), valid = false)
        : ($('#fc-phone').removeClass('is-invalid'), $('#fc-phone-err').removeClass('show'));

    (!check_email(email))
        ? ($('#fc-email').addClass('is-invalid'), $('#fc-email-err').addClass('show'), valid = false)
        : ($('#fc-email').removeClass('is-invalid'), $('#fc-email-err').removeClass('show'));

    if (!valid) { Swal.showValidationMessage('Please fix the errors above.'); return false; }
    return { name, phone, email };
};

// --------------------------- Shared SweetAlert HTML ---------------------------
const customerFormHtml = (name = '', phone = '', email = '') => `
    <div style="text-align:left">
        <label class="flbl">Full Name *</label>
        <input id="fc-name" class="finput w-100 mb-2" placeholder="e.g. Kasun Perera" value="${name}">
        <div id="fc-name-err" class="ferr">Name must be 2–60 letters.</div>

        <label class="flbl">Phone *</label>
        <input id="fc-phone" class="finput w-100 mb-2" placeholder="0771234567" value="${phone}">
        <div id="fc-phone-err" class="ferr">Phone must be 10 digits starting with 0.</div>

        <label class="flbl">Email *</label>
        <input id="fc-email" class="finput w-100 mb-2" type="email" placeholder="name@email.com" value="${email}">
        <div id="fc-email-err" class="ferr">Enter a valid email address.</div>
    </div>`;

// --------------------------- Shared Swal Config ---------------------------
const swalBase = {
    background: '#1a110a',
    color: '#f5e8d8',
    confirmButtonColor: '#E8611A',
    showCancelButton: true,
    cancelButtonColor: '#3d2010',
};

const swalSuccess = (title) =>
    Swal.fire({ icon: 'success', title, background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });

// ========================= ADD CUSTOMER =========================
$('#add-cust-btn').on('click', function () {
    Swal.fire({
        ...swalBase,
        title: 'Add Customer',
        html: customerFormHtml(),
        confirmButtonText: 'Add Customer',
        preConfirm: validateCustomerForm
    }).then(result => {
        if (result.isConfirmed) {
            addCustomerData(result.value.name, result.value.phone, result.value.email);
            loadCustomerTbl();
            populateCustomerSelect();
            swalSuccess('Customer added!');
        }
    });
});

// ========================= EDIT CUSTOMER =========================
$(document).on('click', '.cust-edit-btn', function (e) {
    e.stopPropagation();
    let id  = parseInt($(this).data('id'));
    let obj = getCustomerDataById(id);
    if (!obj) return;

    Swal.fire({
        ...swalBase,
        title: 'Edit Customer',
        html: customerFormHtml(obj.name, obj.phone, obj.email),
        confirmButtonText: 'Save Changes',
        preConfirm: validateCustomerForm
    }).then(result => {
        if (result.isConfirmed) {
            updateCustomerData(id, result.value.name, result.value.phone, result.value.email);
            loadCustomerTbl();
            populateCustomerSelect();
            swalSuccess('Customer updated!');
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
        ...swalBase,
        title: 'Are you sure?',
        text: `Remove customer "${obj.name}"?`,
        icon: 'warning',
        confirmButtonColor: '#5c1a1a',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            deleteCustomerData(id);
            loadCustomerTbl();
            populateCustomerSelect();
            swalSuccess('Customer deleted!');
        }
    });
});

// ========================= SEARCH CUSTOMERS =========================
$('#cust-search').on('input', function () {
    let q       = $(this).val().trim();
    let results = q ? searchCustomerData(q) : getCustomerData();

    $('#cust-table').empty();

    if (!results.length) {
        $('#cust-table').append(`<tr><td colspan="6" class="text-center p-4" style="color:#7a5830;">No customers found.</td></tr>`);
        return;
    }

    results.forEach((item, index) => {
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