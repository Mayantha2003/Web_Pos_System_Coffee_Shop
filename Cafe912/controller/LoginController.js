import { findUserData, getUserData }            from '../model/LoginModel.js';
import { getSettingsData, updateSettingsData }  from '../model/SettingsModel.js';
import { getTodayOrderData }                     from '../model/OrderModel.js';
import { getCustomerData }                       from '../model/CustomerModel.js';
import { getItemData }                           from '../model/ItemModel.js';
import { check_username, check_password }        from '../utils/validation.js';
// import { loadDashboardOrders, loadOrdersTbl }    from './OrderController.js';
// import { loadItemsGrid, loadMenuGrid }           from './itemController.js';
import { loadCustomerTbl, populateCustomerSelect } from './CustomerController.js';
// import { loadCartPanel }                         from './SaleController.js';


// --------------------------- Sign In Button ---------------------------
$('#login-btn').on('click', function () {
    doLogin();
});

const $loginFields = $('#login-user, #login-pass');

// --------------------------- Enter Key ---------------------------
$loginFields.on('keydown', function (e) {
    if (e.key === 'Enter') doLogin();
});

// --------------------------- Clear errors on typing ---------------------------
$loginFields.on('input', function () {
    $(this).removeClass('is-invalid');
    $('#login-error').removeClass('show');
});

// --------------------------- Password eye toggle ---------------------------
$('#toggle-pass').on('click', function () {
    let input = $('#login-pass');
    let isPass = input.attr('type') === 'password';
    input.attr('type', isPass ? 'text' : 'password');
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
});

// --------------------------- Demo account quick-fill ---------------------------
$(document).on('click', '.demo-acc', function () {
    $('#login-user').val($(this).data('user')).removeClass('is-invalid');
    $('#login-pass').val($(this).data('pass')).removeClass('is-invalid');
    $('#login-error').removeClass('show');
    doLogin();
});

// --------------------------- Do Login ---------------------------
const doLogin = () => {
    let username = $('#login-user').val().trim();
    let password = $('#login-pass').val();

    $('#login-user, #login-pass').removeClass('is-invalid');
    $('#login-error').removeClass('show');

    // --- Validate with Validation.js ---
    if (!check_username(username)) {
        $('#login-user').addClass('is-invalid');
        $('#login-error-msg').text('Username must be 3–20 lowercase letters/numbers.');
        $('#login-error').addClass('show');
        return;
    }
    if (!check_password(password)) {
        $('#login-pass').addClass('is-invalid');
        $('#login-error-msg').text('Password must be at least 4 characters.');
        $('#login-error').addClass('show');
        return;
    }

    let $btn = $('#login-btn');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Signing in...');

    setTimeout(() => {
        // --- Fetch from UserModel → reads from DB ---
        let user = findUserData(username, password);

        if (user) {
            showApp(user);
        } else {
            $('#login-error-msg').text('Invalid username or password. Try a demo account below.');
            $('#login-error').addClass('show');
            $('#login-pass').addClass('is-invalid').val('');
        }
        $btn.prop('disabled', false).html('<i class="bi bi-box-arrow-in-right"></i> Sign In');
    }, 600);
};

// --------------------------- Show App After Login ---------------------------
const showApp = (user) => {
    $('#login-screen').addClass('hidden');
    $('#pos-app').addClass('show');

    // Set user info from DB into topbar + sidebar
    $('#topbar-av').text(user.av);
    $('#sb-av').text(user.av);
    $('#sb-uname').text(user.name);
    $('#sb-urole').text(user.role);

    loadGreeting();
    loadDashboard();
    populateCustomerSelect();

    Swal.fire({ icon: 'success', title: `Welcome, ${user.name}! ☕`, background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
};

// --------------------------- Logout ---------------------------
$('#logout-btn, #logout-btn-sb').on('click', function () {
    Swal.fire({
        title: 'Sign out?',
        text: 'Are you sure you want to sign out?',
        icon: 'question',
        background: '#1a110a',
        color: '#f5e8d8',
        showCancelButton: true,
        confirmButtonColor: '#5c1a1a',
        cancelButtonColor: '#3d2010',
        confirmButtonText: 'Yes, sign out'
    }).then(result => {
        if (result.isConfirmed) {
            $('#pos-app').removeClass('show');
            $('#login-screen').removeClass('hidden');
            $('#login-user, #login-pass').val('');
            $('#login-error').removeClass('show');
            navTo('dash');
        }
    });
});

// --------------------------- Navigate to page ---------------------------
const navTo = (pageId) => {
    $('.page').removeClass('active');
    $(`#p-${pageId}`).addClass('active');
    $('.nav-item-btn').removeClass('active');
    $(`.nav-item-btn[data-page="${pageId}"]`).addClass('active');

    // Close sidebar on mobile
    if ($(window).width() < 992) {
        $('#sidebar').removeClass('open');
        $('#sb-overlay').removeClass('show');
    }

    window.scrollTo(0, 0);

    // Refresh data from Models when navigating to each page
    if (pageId === 'dash')      { loadGreeting(); loadDashboard(); }
    if (pageId === 'sale')      { loadMenuGrid('All'); populateCustomerSelect(); }
    if (pageId === 'orders')    { loadOrdersTbl(); }
    if (pageId === 'items')     { loadItemsGrid(); }
    if (pageId === 'customers') { loadCustomerTbl(); }
    if (pageId === 'settings')  { loadSettings('general'); }
};

// Nav buttons
$(document).on('click', '[data-page]', function () { navTo($(this).data('page')); });
$(document).on('click', '[data-goto]', function () { navTo($(this).data('goto')); });

// Sidebar overlay close (mobile)
$('#sb-overlay').on('click', function () {
    $('#sidebar').removeClass('open');
    $(this).removeClass('show');
});

// Hamburger menu toggle
$('#menu-toggle').on('click', function () {
    if ($(window).width() < 992) {
        $('#sidebar').toggleClass('open');
        $('#sb-overlay').toggleClass('show');
    } else {
        $('#sidebar').toggleClass('collapsed');
        $('#main-content').toggleClass('expanded');
    }
});

// Clock
const updateClock = () => {
    $('#clk').text(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
};
setInterval(updateClock, 1000);
updateClock();


// --------------------------- Greeting ---------------------------
const loadGreeting = () => {
    let h     = new Date().getHours();
    let greet = h < 12 ? 'Good morning! ☕' : h < 17 ? 'Good afternoon! ☕' : 'Good evening! 🌙';
    $('#greet-text').text(greet);
    $('#greet-date').text(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
};

// --------------------------- Dashboard Stats ---------------------------
const loadDashboard = () => {
    // --- Fetch data from Models → reads from DB ---
    let todayOrders = getTodayOrderData();
    let totalSales  = todayOrders.reduce((s, o) => s + o.total, 0);
    let avg         = todayOrders.length ? Math.round(totalSales / todayOrders.length) : 0;

    // Update stat cards in HTML
    $('#dash-sales').text('LKR ' + totalSales.toLocaleString());
    $('#dash-orders-count').text(todayOrders.length + ' orders today');
    $('#dash-customers').text(getCustomerData().length);
    $('#dash-items').text(getItemData().length);
    $('#dash-avg').text('LKR ' + avg.toLocaleString());

    loadDashboardOrders();
};

// --------------------------- Load Settings Panel ---------------------------
const loadSettings = (section = 'general') => {
    // --- Fetch from SettingsModel → reads from DB ---
    let s = getSettingsData();
    $('#settings-panel').empty();

    if (section === 'general') {
        $('#settings-panel').html(`
            <div class="sec-hd"><div class="acc"></div> General Settings</div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="flbl">Shop Name</label>
                    <input class="finput" id="set-shopname" value="${s.shopName}">
                </div>
                <div class="col-md-6">
                    <label class="flbl">Branch</label>
                    <input class="finput" id="set-branch" value="${s.branch}">
                </div>
                <div class="col-md-6">
                    <label class="flbl">Currency</label>
                    <select class="fsel" id="set-currency">
                        <option ${s.currency === 'LKR' ? 'selected' : ''}>LKR</option>
                        <option ${s.currency === 'USD' ? 'selected' : ''}>USD</option>
                    </select>
                </div>
            </div>
            <button class="btn-or mt-3" id="save-general-btn">Save Changes</button>`);

        $('#save-general-btn').on('click', function () {
            // --- Pass to SettingsModel → updates DB ---
            updateSettingsData({
                shopName: $('#set-shopname').val().trim(),
                branch:   $('#set-branch').val().trim(),
                currency: $('#set-currency').val()
            });
            Swal.fire({ icon: 'success', title: 'Settings saved!', background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
        });

    } else if (section === 'tax') {
        $('#settings-panel').html(`
            <div class="sec-hd"><div class="acc"></div> Tax & Service</div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="flbl">Service Charge (%)</label>
                    <input class="finput" id="set-svc" type="number" value="${s.serviceCharge}" min="0" max="30">
                </div>
                <div class="col-md-6">
                    <label class="flbl">Tax Rate (%)</label>
                    <input class="finput" id="set-tax" type="number" value="${s.taxRate}" min="0" max="30">
                </div>
                <div class="col-md-6">
                    <label class="flbl">Loyalty Points per LKR 100</label>
                    <input class="finput" id="set-pts" type="number" value="${s.loyaltyPoints}" min="1">
                </div>
            </div>
            <button class="btn-or mt-3" id="save-tax-btn">Save Changes</button>`);

        $('#save-tax-btn').on('click', function () {
            updateSettingsData({
                serviceCharge: parseFloat($('#set-svc').val()) || 10,
                taxRate:       parseFloat($('#set-tax').val()) || 0,
                loyaltyPoints: parseInt($('#set-pts').val())   || 10
            });
            Swal.fire({ icon: 'success', title: 'Settings saved!', background: '#1a110a', color: '#f5e8d8', timer: 1500, showConfirmButton: false });
        });

    } else if (section === 'staff') {
        let rows = getUserData().map(u =>
            `<tr><td>${u.username}</td><td class="nm">${u.name}</td><td><span class="chip chip-br">${u.role.split('·')[0].trim()}</span></td></tr>`
        ).join('');
        $('#settings-panel').html(`
            <div class="sec-hd"><div class="acc"></div> Staff Accounts</div>
            <div class="c-table">
                <table>
                    <thead><tr><th>Username</th><th>Name</th><th>Role</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`);
    }
};

$(document).on('click', '.sni', function () {
    $('.sni').removeClass('active');
    $(this).addClass('active');
    loadSettings($(this).data('set'));
});

export { loadDashboard, navTo };