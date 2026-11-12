
// ==========================================
// PATCHCARE - CHECKOUT JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const checkoutContent = document.getElementById("checkout-content");

    if (!checkoutContent) return;

    const CART_KEY = "patchcare_cart";
    const ORDERS_KEY = "patchcare_orders";
    const USER_KEY = "patchcare_current_user";

    const currentUser = JSON.parse(
    localStorage.getItem(USER_KEY) || "null"
);

if (!currentUser) {
    sessionStorage.setItem(
        "patchcare_after_login",
        "checkout.html"
    );

    window.location.replace("login.html?next=checkout.html");
    return;
}

    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    }

    function formatMoney(amount) {
        if (typeof window.formatPrice === "function") {
            return window.formatPrice(amount);
        }

        return "₱" + Number(amount).toFixed(2);
    }

    function getProduct(id) {
        return window.getProductById(id);
    }

    // ======================================
    // RENDER CHECKOUT
    // ======================================

    function renderCheckout() {

        const cart = getCart();

        if (cart.length === 0) {
            checkoutContent.innerHTML = `
                <div class="empty-content">
                    <h3>Your cart is empty.</h3>
                    <p>You haven't added any products yet.</p>
                    <a href="shop.html" class="btn">
                        Browse Products
                    </a>
                </div>
            `;
            return;
        }

        let subtotal = 0;

        const items = cart.map(item => {
            const product = getProduct(item.id);

            if (!product) return null;

            const quantity = Number(item.quantity);
            const total = product.price * quantity;

            subtotal += total;

            return {
                product,
                quantity,
                total
            };

        }).filter(Boolean);

        if (items.length === 0) {
            checkoutContent.innerHTML = `
                <div class="empty-content">
                    <h3>No valid products found.</h3>
                    <a href="shop.html" class="btn">
                        Continue Shopping
                    </a>
                </div>
            `;
            return;
        }

        checkoutContent.innerHTML = `
            <div class="checkout-layout">

                <div class="checkout-products">

                    <h2>Order Items (${items.length})</h2>

                    ${items.map(item => `
                        <div class="cart-item">

                            <div class="checkout-item-info">
                                <h3>${item.product.name}</h3>

                                <p>
                                    ${formatMoney(item.product.price)}
                                    each
                                </p>

                                <div class="checkout-quantity">
                                    <button
                                        type="button"
                                        data-decrease="${item.product.id}">
                                        −
                                    </button>

                                    <span>${item.quantity}</span>

                                    <button
                                        type="button"
                                        data-increase="${item.product.id}">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div class="checkout-item-actions">
                                <strong>
                                    ${formatMoney(item.total)}
                                </strong>

                                <button
                                    type="button"
                                    class="remove-item"
                                    data-remove="${item.product.id}">
                                    Remove
                                </button>
                            </div>

                        </div>
                    `).join("")}

                    <a href="shop.html" class="btn btn-light mt-20">
                        Continue Shopping
                    </a>

                </div>

                <div class="checkout-form-section">

                    <h2>Delivery Information</h2>

                    <form id="checkout-form">

                        <div class="form-group">
                            <label for="customer-name">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="customer-name"
                                name="customerName"
                                required
                                placeholder="Enter your full name">
                        </div>

                        <div class="form-group">
                            <label for="customer-email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="customer-email"
                                name="email"
                                required
                                placeholder="Enter your email">
                        </div>

                        <div class="form-group">
                            <label for="customer-phone">
                                Contact Number
                            </label>

                            <input
                                type="tel"
                                id="customer-phone"
                                name="phone"
                                required
                                placeholder="09XXXXXXXXX">
                        </div>

                        <div class="form-group">
                            <label for="customer-address">
                                Complete Delivery Address
                            </label>

                            <textarea
                                id="customer-address"
                                name="address"
                                rows="3"
                                required
                                placeholder="House number, street, barangay, city"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="payment-method">
                                Payment Method
                            </label>

                            <select
                                id="payment-method"
                                name="payment"
                                required>

                                <option value="">
                                    Select Payment Method
                                </option>

                                <option value="Cash on Delivery">
                                    Cash on Delivery
                                </option>

                                <option value="GCash">
                                    GCash
                                </option>

                            </select>
                        </div>

                        <div class="cart-summary">

                            <h3>Order Summary</h3>

                            <div class="cart-total">
                                <span>Subtotal</span>
                                <span>${formatMoney(subtotal)}</span>
                            </div>

                            <div class="cart-total">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div class="cart-total">
                                <span>Total</span>
                                <span>${formatMoney(subtotal)}</span>
                            </div>

                            <button
                                type="submit"
                                class="btn"
                                style="width:100%">
                                Place Order
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;

        // PREFILL LOGGED-IN USER

        const user = JSON.parse(
            localStorage.getItem(USER_KEY) || "null"
        );

        if (user) {
            document.getElementById("customer-name").value =
                user.name || "";

            document.getElementById("customer-email").value =
                user.email || "";
        }

    }

    // ======================================
    // QUANTITY AND REMOVE BUTTONS
    // ======================================

    checkoutContent.addEventListener("click", function (event) {

        const increase = event.target.closest("[data-increase]");
        const decrease = event.target.closest("[data-decrease]");
        const remove = event.target.closest("[data-remove]");

        let cart = getCart();

        if (increase) {

            const id = Number(increase.dataset.increase);
            const item = cart.find(item => item.id === id);
            const product = getProduct(id);

            if (!item || !product) return;

            if (item.quantity >= product.stock) {
                alert("Maximum available stock reached.");
                return;
            }

            item.quantity++;

            saveCart(cart);
            renderCheckout();
        }

        if (decrease) {

            const id = Number(decrease.dataset.decrease);
            const item = cart.find(item => item.id === id);

            if (!item) return;

            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }

            saveCart(cart);
            renderCheckout();
        }

        if (remove) {

            const id = Number(remove.dataset.remove);

            cart = cart.filter(item => item.id !== id);

            saveCart(cart);
            renderCheckout();
        }

    });

    // ======================================
    // PLACE ORDER
    // ======================================

    checkoutContent.addEventListener("submit", function (event) {

        if (event.target.id !== "checkout-form") return;

        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            renderCheckout();
            return;
        }

        const form = event.target;

        if (!form.reportValidity()) return;

        const user = JSON.parse(
            localStorage.getItem(USER_KEY) || "null"
        );

        const items = cart.map(item => {

            const product = getProduct(item.id);

            if (!product) return null;

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: product.price * item.quantity
            };

        }).filter(Boolean);

        if (items.length !== cart.length) {
            alert("Some products are no longer available.");
            return;
        }

        for (const item of cart) {

            const product = getProduct(item.id);

            if (
                !product ||
                item.quantity < 1 ||
                item.quantity > product.stock
            ) {
                alert("One or more products have insufficient stock.");
                return;
            }

        }

        const total = items.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        const order = {
            id: Date.now(),
            userId: user ? user.id : null,
            customer: {
                name: form.elements.customerName.value.trim(),
                email: form.elements.email.value.trim(),
                phone: form.elements.phone.value.trim(),
                address: form.elements.address.value.trim()
            },
            payment: form.elements.payment.value,
            items: items,
            total: total,
            date: new Date().toLocaleString(),
            status: "Pending"
        };

        const orders = getOrders();

        orders.push(order);

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );

        localStorage.removeItem(CART_KEY);

        checkoutContent.innerHTML = `
            <div class="empty-content">

                <h2 style="color:#16A34A">
                    Order Placed Successfully!
                </h2>

                <p>
                    Thank you for shopping with PatchCare.
                </p>

                <h3>Order #${order.id}</h3>

                <p>
                    Total:
                    <strong>${formatMoney(order.total)}</strong>
                </p>

                <p>
                    Payment:
                    ${order.payment}
                </p>

                <p>
                    Status:
                    Pending
                </p>

                <br>

                <a href="orders.html" class="btn">
                    View My Orders
                </a>

                <a href="shop.html" class="btn btn-light">
                    Continue Shopping
                </a>

            </div>
        `;

        alert("Your order has been placed successfully!");

    });

    // INITIAL RENDER

    renderCheckout();

});
