import { getItemDataById, searchItemData, getItemDataByCategory } from '../model/ItemModel.js';
import { addOrderData, calculateOrderTotal }                        from '../model/OrderModel.js';
import { populateCustomerSelect }                                    from './CustomerController.js';

// Cart state: { itemId: { id, name, price, qty } }
let cart = {};

// --------------------------- Load Menu Grid ---------------------------
const loadMenuGrid = (category = 'All') => {
    $('#menu-grid').empty();
    let items = getItemDataByCategory(category);

    if (!items.length) {
        $('#menu-grid').append(`<div class="col-12 text-center p-4" style="color:v#7a5830;">No items found.</div>`);
        return;
    }

    items.map(item => {
        $('#menu-grid').append(`
            <div class="col-6 col-md-4 col-xl-3">
                <div class="mi menu-item-card" data-id="${item.id}">
                    <div class="mi-ico">${item.emoji}</div>
                    <div class="mi-nm">${item.name}</div>
                    <div class="mi-pr">LKR ${item.price.toLocaleString()}</div>
                </div>
            </div>`);
    });
};

// --------------------------- Click Menu Item → Add to Cart ---------------------------
$(document).on('click', '.menu-item-card', function () {
    let id   = parseInt($(this).data('id'));
    let item = getItemDataById(id); // fetch from ItemModel → DB
    if (!item) return;

    if (!cart[id]) cart[id] = { id: item.id, name: item.name, price: item.price, qty: 0 };
    cart[id].qty++;
    loadCartPanel();
});

// --------------------------- Load Cart Panel ---------------------------
const loadCartPanel = () => {
    let entries = Object.values(cart);
    $('#oi-list').empty();

    if (!entries.length) {
        $('#oi-list').html(`
            <div class="empty-cart">
                <div class="empty-ico">🛒</div>
                <div style="font-size:13px">No items yet</div>
                <div style="font-size:11px;margin-top:3px">Tap a menu item</div>
            </div>`);
        $('#oi-cnt').text('0 items');
        $('#o-sub, #o-svc, #o-tot').text('LKR 0');
        return;
    }

    entries.map(v => {
        $('#oi-list').append(`
            <div class="oi">
                <div class="oi-nm">${v.name}</div>
                <div class="qty-ctrl">
                    <div class="qb cart-minus" data-id="${v.id}">−</div>
                    <span style="font-size:12px;min-width:18px;text-align:center">${v.qty}</span>
                    <div class="qb cart-plus" data-id="${v.id}">+</div>
                </div>
                <div class="oi-pr">LKR ${(v.price * v.qty).toLocaleString()}</div>
            </div>`);
    });

    let { sub, svc, total } = calculateOrderTotal(entries);
    $('#oi-cnt').text(entries.length + ' item' + (entries.length > 1 ? 's' : ''));
    $('#o-sub').text('LKR ' + sub.toLocaleString());
    $('#o-svc').text('LKR ' + svc.toLocaleString());
    $('#o-tot').text('LKR ' + total.toLocaleString());
};

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

    (items.length === 0)
        ? Swal.fire({ icon: 'error', title: 'Cart is empty!', background: '#1a110a', color: '#f5e8d8' })
        : Swal.fire({
            title: 'Confirm Payment?',
            text: `Total: LKR ${calculateOrderTotal(items).total.toLocaleString()}`,
            icon: 'question',
            background: '#1a110a',
            color: '#f5e8d8',
            showCancelButton: true,
            confirmButtonColor: '#E8611A',
            cancelButtonColor: '#3d2010',
            confirmButtonText: 'Yes, process it!'
        }).then(result => {
            if (result.isConfirmed) {
                let customerId = parseInt($('#order-customer').val()) || null;
                let type       = $('#order-type').val();

                // --- Pass to OrderModel → writes to DB ---
                let order = addOrderData(customerId, type, items);

                cart = {};
                loadCartPanel();
                populateCustomerSelect();

                Swal.fire({
                    icon: 'success',
                    title: `Order ${order.id} Complete!`,
                    text: `Total: LKR ${order.total.toLocaleString()}`,
                    background: '#1a110a',
                    color: '#f5e8d8',
                    timer: 2000,
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

    items.map(item => {
        $('#menu-grid').append(`
            <div class="col-6 col-md-4 col-xl-3">
                <div class="mi menu-item-card" data-id="${item.id}">
                    <div class="mi-ico">${item.emoji}</div>
                    <div class="mi-nm">${item.name}</div>
                    <div class="mi-pr">LKR ${item.price.toLocaleString()}</div>
                </div>
            </div>`);
    });
});

// --------------------------- Initial Load ---------------------------
loadMenuGrid('All');

export { loadMenuGrid, loadCartPanel };