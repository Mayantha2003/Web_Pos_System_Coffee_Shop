import { getItemDataById, searchItemData, getItemDataByCategory } from '../model/ItemModel.js';
import { addOrderData, calculateOrderTotal }                       from '../model/OrderModel.js';
import { populateCustomerSelect }                                  from './CustomerController.js';
import { loadOrdersTbl }                                           from './OrderController.js';

// Cart state
let cart = {};

// --------------------------- Load Menu Grid ---------------------------
const loadMenuGrid = (category = 'All') => {
    $('#menu-grid').empty();
    let items = getItemDataByCategory(category);

    if (!items.length) {
        $('#menu-grid').append(`<div class="col-12 text-center p-4" style="color:#7a5830;">No items found.</div>`);
        return;
    }

    // ✅ emoji removed
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

// --------------------------- Click Menu Item → Add to Cart ---------------------------
$(document).on('click', '.menu-item-card', function () {
    let id   = parseInt($(this).data('id'));
    let item = getItemDataById(id);
    if (!item) return;

    if (!cart[id]) cart[id] = { id: item.id, name: item.name, price: item.price, qty: 0 };
    cart[id].qty++;
    loadCartPanel();
});

// --------------------------- Load Cart Panel ---------------------------
const loadCartPanel = () => {
    let entries = Object.values(cart);
    $('#oi-list').empty();
    $('#cash-input-row').hide();
    $('#balance-row').hide();

    if (!entries.length) {
        $('#oi-list').html(`
            <div class="empty-cart">
                <div class="empty-ico">🛒</div>
                <div style="font-size:13px">No items yet</div>
                <div style="font-size:11px;margin-top:3px">Tap a menu item</div>
            </div>`);
        $('#oi-cnt').text('0 items');
        $('#o-tot').text('LKR 0');
        return;
    }

    entries.forEach(v => {
        $('#oi-list').append(`
            <div class="oi">
                <div class="oi-nm">${v.name}</div>
                <div class="qty-ctrl">
                    <div class="qb cart-minus" data-id="${v.id}">−</div>
                    <span style="font-size:12px;min-width:18px;text-align:center">${v.qty}</span>
                    <div class="qb cart-plus"  data-id="${v.id}">+</div>
                </div>
                <div class="oi-pr">LKR ${(v.price * v.qty).toLocaleString()}</div>
            </div>`);
    });

    // ✅ Total only, no service charge
    let { total } = calculateOrderTotal(entries);
    $('#oi-cnt').text(entries.length + ' item' + (entries.length > 1 ? 's' : ''));
    $('#o-tot').text('LKR ' + total.toLocaleString());

    // ✅ Show cash input when cart has items
    $('#cash-input-row').show();
    $('#o-cash').val('');
    $('#balance-row').hide();
};

// --------------------------- Cash Input → Calculate Balance ---------------------------
$(document).on('input', '#o-cash', function () {
    let entries = Object.values(cart);
    if (!entries.length) return;

    let { total } = calculateOrderTotal(entries);
    let cash      = parseFloat($(this).val()) || 0;
    let balance   = cash - total;

    if (cash <= 0) { $('#balance-row').hide(); return; }

    $('#o-balance').text('LKR ' + balance.toLocaleString());
    $('#o-balance').css('color', balance >= 0 ? '#4caf50' : '#e53935');
    $('#balance-row').show();
});

// --------------------------- Cart + / - Buttons ---------------------------
$(document).on('click', '.cart-plus', function () {
    let id = parseInt($(this).data('id'));
    if (cart[id]) { cart[id].qty++; loadCartPanel(); }
});

$(document).on('click', '.cart-minus', function () {
    let id = parseInt($(this).data('id'));
    if (!cart[id]) return;
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
    loadCartPanel();
});

// --------------------------- Clear Cart ---------------------------
$('#clear-btn').on('click', function () {
    cart = {};
    loadCartPanel();
});

// ========================= PROCESS PAYMENT =========================
$('#pay-btn').on('click', function () {
    let items = Object.values(cart);
    if (!items.length) {
        Swal.fire({ icon: 'error', title: 'Cart is empty!', background: '#1a110a', color: '#f5e8d8' });
        return;
    }

    let { total } = calculateOrderTotal(items);
    let cash      = parseFloat($('#o-cash').val()) || 0;

    // ✅ Must enter cash and it must cover total
    if (cash <= 0) {
        Swal.fire({ icon: 'warning', title: 'Enter cash amount!', background: '#1a110a', color: '#f5e8d8' });
        return;
    }
    if (cash < total) {
        Swal.fire({ icon: 'error', title: 'Insufficient cash!', text: `Need LKR ${total.toLocaleString()}, got LKR ${cash.toLocaleString()}`, background: '#1a110a', color: '#f5e8d8' });
        return;
    }

    let balance = cash - total;

    Swal.fire({
        title: 'Confirm Payment',
        html: `
            <div style="text-align:left;font-size:14px;color:#c4a882">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                    <span>Total</span><span style="color:#E8611A;font-weight:600">LKR ${total.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                    <span>Cash</span><span>LKR ${cash.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;margin-top:8px;border-top:1px solid #3d2010;padding-top:8px">
                    <span>Balance</span><span style="color:#4caf50">LKR ${balance.toLocaleString()}</span>
                </div>
            </div>`,
        icon: 'question',
        background: '#1a110a',
        color: '#f5e8d8',
        showCancelButton: true,
        confirmButtonColor: '#E8611A',
        cancelButtonColor: '#3d2010',
        confirmButtonText: 'Confirm & Save'
    }).then(result => {
        if (result.isConfirmed) {
            let customerId = parseInt($('#order-customer').val()) || null;
            let type       = $('#order-type').val();

            // ✅ Save order to DB
            let order = addOrderData(customerId, type, items);

            // ✅ Clear cart
            cart = {};
            loadCartPanel();
            populateCustomerSelect();

            // ✅ Refresh orders table if visible
            loadOrdersTbl();

            Swal.fire({
                icon: 'success',
                title: `Order ${order.id} Saved!`,
                html: `<div style="color:#c4a882">Total: <b style="color:#E8611A">LKR ${order.total.toLocaleString()}</b><br>Balance: <b style="color:#4caf50">LKR ${balance.toLocaleString()}</b></div>`,
                background: '#1a110a',
                color: '#f5e8d8',
                timer: 2500,
                showConfirmButton: false
            });
        }
    });
});

// ========================= CATEGORY TABS =========================
$('#cat-tabs').on('click', '.ct', function () {
    $('#cat-tabs .ct').removeClass('active');
    $(this).addClass('active');
    loadMenuGrid($(this).data('cat'));
});

// ========================= SEARCH MENU =========================
$('#sale-search').on('input', function () {
    let q   = $(this).val().trim();
    let cat = $('#cat-tabs .ct.active').data('cat') || 'All';
    $('#menu-grid').empty();

    let items = q ? searchItemData(q) : getItemDataByCategory(cat);

    if (!items.length) {
        $('#menu-grid').append(`<div class="col-12 text-center p-4" style="color:#7a5830;">No items found.</div>`);
        return;
    }

    // ✅ emoji removed
    items.forEach(item => {
        $('#menu-grid').append(`
            <div class="col-6 col-md-4 col-xl-3">
                <div class="mi menu-item-card" data-id="${item.id}">
                    <div class="mi-nm">${item.name}</div>
                    <div class="mi-pr">LKR ${item.price.toLocaleString()}</div>
                </div>
            </div>`);
    });
});

// --------------------------- Initial Load ---------------------------
loadMenuGrid('All');

export { loadMenuGrid, loadCartPanel };