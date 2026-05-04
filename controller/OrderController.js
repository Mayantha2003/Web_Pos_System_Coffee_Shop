import { getOrderData, getOrderDataById, getRecentOrderData,
    getTodayOrderData, searchOrderData }  from '../model/OrderModel.js';
import { getCustomerDataById }                 from '../model/CustomerModel.js';

// --------------------------- Shared Row Builder ---------------------------
const buildOrderRow = (item, index) => {
    let cust     = item.customerId ? (getCustomerDataById(item.customerId)?.name || 'Walk-in') : 'Walk-in';
    let itemList = item.items.map(i => `${i.name} x${i.qty}`).join(', ');
    let badge    = item.status === 'completed'
        ? '<span class="chip chip-gn">Completed</span>'
        : '<span class="chip chip-or">Pending</span>';

    return `
        <tr data-index="${index}" data-id="${item.id}" class="order-row">
            <td class="hi">${item.id}</td>
            <td class="nm">${cust}</td>
            <td><span class="chip chip-br">${item.type}</span></td>
            <td style="font-size:12px">${itemList}</td>
            <td class="hi">LKR ${item.total.toLocaleString()}</td>
            <td style="color:#7a5830;">${item.date}</td>
            <td>${badge}</td>
        </tr>`;
};

// --------------------------- Load Orders Table ---------------------------
const loadOrdersTbl = () => {
    $('#orders-table').empty();
    let orders = getOrderData();

    if (!orders.length) {
        $('#orders-table').append(`<tr><td colspan="7" class="text-center p-4" style="color:#7a5830;">No orders found.</td></tr>`);
        return;
    }

    // ✅ forEach instead of map (side effects only)
    orders.forEach((item, index) => {
        $('#orders-table').append(buildOrderRow(item, index));
    });
};

// --------------------------- Click Row → Show Order Detail ---------------------------
$('#orders-table').on('click', 'tr', function () {
    let id    = $(this).data('id');
    let order = getOrderDataById(id);
    if (!order) return;

    let cust = order.customerId
        ? (getCustomerDataById(order.customerId)?.name || 'Walk-in')
        : 'Walk-in';

    $('#od-id').text('Order ' + order.id);
    $('#od-meta').text(order.date + ' · ' + order.type);
    $('#od-cust').text(cust);
    $('#od-total').text('LKR ' + order.total.toLocaleString());

    $('#od-items').empty();
    order.items.forEach(i => {
        $('#od-items').append(`
            <div style="display:flex;justify-content:space-between;padding:7px 0;
                        border-bottom:1px solid rgba(200,140,80,0.14);
                        font-size:13px;color:#c4a882;">
                <span>${i.name} × ${i.qty}</span>
                <span style="color:#E8611A;">LKR ${(i.price * i.qty).toLocaleString()}</span>
            </div>`);
    });

    // ✅ Show total in detail panel
    $('#od-items').append(`
        <div style="display:flex;justify-content:space-between;padding:10px 0 4px;
                    font-size:14px;font-weight:700;color:#f5e8d8;margin-top:4px">
            <span>Total</span>
            <span style="color:#E8611A;">LKR ${order.total.toLocaleString()}</span>
        </div>`);

    $('#od-panel').show();
    $('html, body').animate({ scrollTop: $('#od-panel').offset().top - 80 }, 400);
});

// --------------------------- Close Detail Panel ---------------------------
$('#od-close').on('click', function () {
    $('#od-panel').hide();
});

// ========================= SEARCH ORDERS =========================
$('#orders-search').on('input', function () {
    let q       = $(this).val().trim();
    let results = q ? searchOrderData(q, getCustomerDataById) : getOrderData();

    $('#orders-table').empty();

    if (!results.length) {
        $('#orders-table').append(`<tr><td colspan="7" class="text-center p-4" style="color:#7a5830;">No orders found.</td></tr>`);
        return;
    }

    results.forEach((item, index) => {
        $('#orders-table').append(buildOrderRow(item, index));
    });
});

// --------------------------- Load Dashboard Recent Orders ---------------------------
const loadDashboardOrders = () => {
    $('#dash-orders-table').empty();
    let recent = getRecentOrderData(5);

    if (!recent.length) {
        $('#dash-orders-table').append(`<tr><td colspan="5" class="text-center p-3" style="color:#7a5830;">No orders yet.</td></tr>`);
        return;
    }

    recent.forEach(o => {
        let cust  = o.customerId ? (getCustomerDataById(o.customerId)?.name || 'Walk-in') : 'Walk-in';
        let badge = o.status === 'completed'
            ? '<span class="chip chip-gn">Completed</span>'
            : '<span class="chip chip-or">Pending</span>';

        $('#dash-orders-table').append(`
            <tr>
                <td class="hi">${o.id}</td>
                <td>${cust}</td>
                <td style="font-size:12px">${o.items.map(i => i.name).join(', ')}</td>
                <td class="hi">LKR ${o.total.toLocaleString()}</td>
                <td>${badge}</td>
            </tr>`);
    });
};

// --------------------------- Initial Load ---------------------------
loadOrdersTbl();

export { loadOrdersTbl, loadDashboardOrders };