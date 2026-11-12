
// ==========================================
// PATCHCARE - AUTHENTICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const USERS_KEY = "patchcare_users";
    const CURRENT_USER_KEY = "patchcare_current_user";
    const ORDERS_KEY = "patchcare_orders";

    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // ======================================
    // SIGN UP
    // ======================================

    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = signupForm.elements.name.value.trim();
            const email = signupForm.elements.email.value.trim().toLowerCase();
            const username = signupForm.elements.username.value.trim().toLowerCase();
            const password = signupForm.elements.password.value;
            const confirm = signupForm.elements.confirm.value;

            if (password !== confirm) {
                alert("Passwords do not match.");
                return;
            }

            if (password.length < 6) {
                alert("Password must have at least 6 characters.");
                return;
            }

            const users = getUsers();

            const existingUser = users.find(user =>
                user.email === email || user.username === username
            );

            if (existingUser) {
                alert("Email or username is already registered.");
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                username: username,
                password: password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);

            alert("Account created successfully!");

            window.location.href = "login.html";
        });
    }

    // ======================================
    // LOGIN
    // ======================================

    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const identity = loginForm.elements.identity.value.trim().toLowerCase();
            const password = loginForm.elements.password.value;

            const users = getUsers();

            const user = users.find(account =>
                (account.email === identity ||
                 account.username === identity) &&
                account.password === password
            );

            if (!user) {
                alert("Incorrect email, username, or password.");
                return;
            }

            const loggedInUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username
            };

            localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(loggedInUser)
);

// CONNECT PREVIOUS GUEST ORDERS TO THIS ACCOUNT
const orders = JSON.parse(
    localStorage.getItem(ORDERS_KEY) || "[]"
);

const updatedOrders = orders.map(order => {
    if (
        !order.userId &&
        order.customer &&
        order.customer.email &&
        order.customer.email.toLowerCase() === user.email.toLowerCase()
    ) {
        return {
            ...order,
            userId: user.id
        };
    }

    return order;
});

localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(updatedOrders)
);

            alert("Welcome back, " + user.name + "!");

            const nextPage = new URLSearchParams(
    window.location.search
).get("next");

const savedPage = sessionStorage.getItem(
    "patchcare_after_login"
);

const destination =
    nextPage === "checkout.html" ||
    savedPage === "checkout.html"
        ? "checkout.html"
        : "profile.html";

sessionStorage.removeItem("patchcare_after_login");

window.location.href = destination;
        });
    }

    // ======================================
    // PASSWORD VISIBILITY
    // ======================================

    document.querySelectorAll("[data-toggle]").forEach(button => {
        button.addEventListener("click", function () {
            const input = document.getElementById(this.dataset.toggle);

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Hide";
            } else {
                input.type = "password";
                this.textContent = "Show";
            }
        });
    });

    // ======================================
    // PROFILE
    // ======================================

    const profileContent = document.getElementById("profile-content");

    if (profileContent) {
        const user = getCurrentUser();

        if (!user) {
            profileContent.innerHTML = `
                <div class="empty-content">
                    <h3>Please log in first.</h3>
                    <a href="login.html" class="btn">Log In</a>
                </div>
            `;
        } else {
            profileContent.innerHTML = `
                <div class="form-container">
                    <h2>Account Information</h2>

                    <div class="form-group">
                        <label>Full Name</label>
                        <input value="${user.name}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Email Address</label>
                        <input value="${user.email}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Username</label>
                        <input value="${user.username}" readonly>
                    </div>

                    <a href="orders.html" class="btn full-width">
                        View My Orders
                    </a>

                    <button type="button" class="btn btn-light full-width mt-20"
                        id="logout-button">
                        Log Out
                    </button>
                </div>
            `;

            document.getElementById("logout-button")
                .addEventListener("click", function () {
                    localStorage.removeItem(CURRENT_USER_KEY);
                    alert("You have been logged out.");
                    window.location.href = "index.html";
                });
        }
    }

    // ======================================
    // MY ORDERS
    // ======================================

    const ordersContent = document.getElementById("orders-content");

    if (ordersContent) {
        const user = getCurrentUser();

        if (!user) {
            ordersContent.innerHTML = `
                <div class="empty-content">
                    <h3>Please log in to view your orders.</h3>
                    <a href="login.html" class="btn">Log In</a>
                </div>
            `;
        } else {
            const orders = JSON.parse(
                localStorage.getItem(ORDERS_KEY) || "[]"
            );

            const userOrders = orders.filter(
    order => String(order.userId) === String(user.id)
);

            if (userOrders.length === 0) {
                ordersContent.innerHTML = `
                    <div class="empty-content">
                        <h3>No orders yet.</h3>
                        <p>Your purchases will appear here.</p>
                        <a href="shop.html" class="btn">
                            Start Shopping
                        </a>
                    </div>
                `;
            } else {
                ordersContent.innerHTML = userOrders.map(order => `
                    <div class="cart-item">
                        <div>
                            <h3>Order #${order.id}</h3>
                            <p>${order.date || ""}</p>
                            <p>Status: ${order.status || "Pending"}</p>
                        </div>

                        <strong>
                            ${window.formatPrice(order.total)}
                        </strong>
                    </div>
                `).join("");
            }
        }
    }

});
