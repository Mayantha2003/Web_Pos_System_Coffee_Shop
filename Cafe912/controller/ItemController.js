import { addItemData, updateItemData, deleteItemData,
    getItemData, getItemDataById, getItemDataByCategory,
    searchItemData } from '../model/ItemModel.js';

import { check_itemName, check_price } from '../utils/validation.js';

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

// --------------------------- Shared Form HTML ---------------------------
const itemFormHtml = (name = '', price = '', category = 'Coffee') => `
    <div style="text-align:left">
        <label class="flbl">Item Name *</label>
        <input id="fi-name" class="finput w-100 mb-2" placeholder="e.g. Caramel Latte" value="${name}">
        <div id="fi-name-err" class="ferr">Item name must be 2–50 characters.</div>

        <label class="flbl">Price (LKR) *</label>
        <input id="fi-price" class="finput w-100 mb-2" type="number" placeholder="450" value="${price}">
        <div id="fi-price-err" class="ferr">Enter a valid price (e.g. 450).</div>

        <label class="flbl">Category *</label>
        <select id="fi-cat" class="fsel w-100 mb-2">
            ${['Coffee', 'Tea', 'Food', 'Cold Drinks'].map(c =>
    `<option ${category === c ? 'selected' : ''}>${c}</option>`
).join('')}
        </select>
    </div>`;

// --------------------------- Shared Validation ---------------------------
const validateItemForm = () => {
    let name  = $('#fi-name').val().trim();
    let price = $('#fi-price').val().trim();
    let valid = true;

    (!check_itemName(name))
        ? ($('#fi-name').addClass('is-invalid'),  $('#fi-name-err').addClass('show'),  valid = false)
        : ($('#fi-name').removeClass('is-invalid'),  $('#fi-name-err').removeClass('show'));

    (!check_price(price))
        ? ($('#fi-price').addClass('is-invalid'), $('#fi-price-err').addClass('show'), valid = false)
        : ($('#fi-price').removeClass('is-invalid'), $('#fi-price-err').removeClass('show'));

    if (!valid) { Swal.showValidationMessage('Please fix the errors above.'); return false; }

    return {
        name,
        price:    parseFloat(price),
        category: $('#fi-cat').val()
    };
};

// --------------------------- Load Items Grid (Read) ---------------------------
const loadItemsGrid = () => {
    $('#items-grid').empty();

    let cat   = $('#items-cat-filter').val();
    let q     = $('#items-search').val().trim();
    let items = q ? searchItemData(q) : getItemData();
    if (cat) items = items.filter(i => i.category === cat);

    if (!items.length) {
        $('#items-grid').append(`<div class="col-12 text-center p-4" style="color:#7a5830;">No items found.</div>`);
        return;
    }

    items.forEach(item => {
        $('#items-grid').append(`
        <div class="col-6 col-md-4 col-xl-3">
            <div class="c-card text-center" style="padding:16px">
                <div style="font-size:13px;font-weight:500;color:#f5e8d8;margin-bottom:2px">${item.name}</div>
                <div style="font-size:15px;font-weight:600;color:#E8611A;margin-bottom:5px">LKR ${item.price.toLocaleString()}</div>
                <div style="margin-bottom:10px"><span class="chip chip-br">${item.category}</span></div>
                <div style="display:flex;gap:5px;justify-content:center">
                    <button class="ab ab-ed item-edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="ab ab-dl item-delete-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>`);
    });
};

// --------------------------- Load Menu Grid (Sale page) ---------------------------
const loadMenuGrid = (category = 'All') => {
    $('#menu-grid').empty();
    let items = getItemDataByCategory(category);

    if (!items.length) {
        $('#menu-grid').append(`<div class="col-12 text-center p-4" style="color:#7a5830">No items found.</div>`);
        return;
    }

    items.forEach(item => {
        $('#menu-grid').append(`
        <div class="col-6 col-md-4 col-xl-3">
            <div class="mi menu-item-card" data-id="${item.id}">
                <div class="mi-nm">${item.name}</div>
                <div class="mi-pr">LKR ${item.price.toLocaleString()}</div>
            </div>
        </div>`);
    });
};

// ========================= ADD ITEM =========================
$('#add-item-btn').on('click', function () {
    Swal.fire({
        ...swalBase,
        title: 'Add Menu Item',
        html: itemFormHtml(),
        confirmButtonText: 'Add Item',
        preConfirm: validateItemForm
    }).then(result => {
        if (result.isConfirmed) {
            addItemData(result.value.name, result.value.price, result.value.category);
            loadItemsGrid();
            swalSuccess('Item added!');
        }
    });
});

// ========================= EDIT ITEM =========================
$(document).on('click', '.item-edit-btn', function (e) {
    e.stopPropagation();
    let id  = parseInt($(this).data('id'));
    let obj = getItemDataById(id);
    if (!obj) return;

    Swal.fire({
        ...swalBase,
        title: 'Edit Menu Item',
        html: itemFormHtml(obj.name, obj.price, obj.category),
        confirmButtonText: 'Save Changes',
        preConfirm: validateItemForm
    }).then(result => {
        if (result.isConfirmed) {
            updateItemData(id, result.value.name, result.value.price, result.value.category);
            loadItemsGrid();
            swalSuccess('Item updated!');
        }
    });
});

// ========================= DELETE ITEM =========================
$(document).on('click', '.item-delete-btn', function (e) {
    e.stopPropagation();
    let id  = parseInt($(this).data('id'));
    let obj = getItemDataById(id);
    if (!obj) return;

    Swal.fire({
        ...swalBase,
        title: 'Are you sure?',
        text: `Remove "${obj.name}" from the menu?`,
        icon: 'warning',
        confirmButtonColor: '#5c1a1a',
        confirmButtonText: 'Yes, remove it!'
    }).then(result => {
        if (result.isConfirmed) {
            deleteItemData(id);
            loadItemsGrid();
            swalSuccess('Item removed!');
        }
    });
});

// ========================= SEARCH & FILTER =========================
$('#items-search').on('input',  function () { loadItemsGrid(); });
$('#items-cat-filter').on('change', function () { loadItemsGrid(); });

// --------------------------- Initial Load ---------------------------
loadItemsGrid();

export { loadItemsGrid, loadMenuGrid };