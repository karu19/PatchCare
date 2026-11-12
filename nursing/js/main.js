
// ==========================================
// PATCHCARE - MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const products = window.PATCHCARE_PRODUCTS || [];

    // ======================================
    // HEADER
    // ======================================

    const header = document.getElementById("site-header");

    if (header) {
        header.innerHTML = `
            <div class="container site-header">
                <a href="index.html" class="logo">
                    <span class="logo-icon">＋</span>
                    Patch<span>Care</span>
                </a>

                <nav class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="shop.html">Shop</a>
                    <a href="contact.html">Contact</a>
                    <a href="orders.html">My Orders</a>
                    <a href="profile.html">Profile</a>
                </nav>

                <div class="nav-actions">
                    <a href="login.html" class="btn btn-light btn-small">
                        Account
                    </a>
                    <a href="checkout.html" class="btn btn-small">
                        Cart
                    </a>
                </div>
            </div>
        `;

        const currentPage = location.pathname.split("/").pop() || "index.html";

        header.querySelectorAll(".nav-links a").forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    }

    // ======================================
    // FOOTER
    // ======================================

    const footer = document.getElementById("site-footer");

    if (footer) {
        footer.innerHTML = `
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-grid">

                        <div>
                            <a href="index.html" class="logo" style="color:white">
                                <span class="logo-icon">＋</span>
                                Patch<span>Care</span>
                            </a>
                            <p style="margin-top:18px;max-width:300px">
                                Everyday care essentials made simple.
                                Discover practical patch products for
                                your personal care needs.
                            </p>
                        </div>

                        <div>
                            <h3>Quick Links</h3>
                            <div class="footer-links">
                                <a href="index.html">Home</a>
                                <a href="shop.html">Shop</a>
                                <a href="contact.html">Contact</a>
                            </div>
                        </div>

                        <div>
                            <h3>My Account</h3>
                            <div class="footer-links">
                                <a href="login.html">Login</a>
                                <a href="signup.html">Register</a>
                                <a href="orders.html">My Orders</a>
                                <a href="profile.html">My Profile</a>
                            </div>
                        </div>

                    </div>

                    <div class="footer-bottom">
                        © ${new Date().getFullYear()} PatchCare.
                        All rights reserved.
                    </div>
                </div>
            </footer>
        `;
    }

    // ======================================
    // PRODUCT CARD
    // ======================================

   
function createProductCard(product) {
    return `
        <article class="product-card">

            <button class="product-image-button"
                type="button"
                data-view-product="${product.id}">
                <div class="product-image">
                    ${
                        product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : `<span class="medical-cross">＋</span>`
                    }
                </div>
            </button>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    <button class="product-title-button"
                        type="button"
                        data-view-product="${product.id}">
                        ${product.name}
                    </button>
                </h3>

                <p>${product.description}</p>

                <div class="product-price">
                    ${window.formatPrice(product.price)}
                </div>

                <button class="btn"
                    type="button"
                    data-add-cart="${product.id}">
                    Add to Cart
                </button>

            </div>
        </article>
    `;
}


    // ======================================
    // PRODUCT DETAILS MODAL
    // ======================================

    const productModal = document.createElement("div");
    productModal.id = "product-modal";
    productModal.className = "product-modal";

    productModal.innerHTML = `
        <div class="product-modal-backdrop"
             data-close-product-modal></div>

        <section class="product-modal-box"
                 role="dialog"
                 aria-modal="true"
                 aria-label="Product details">

            <button class="product-modal-close"
                    type="button"
                    data-close-product-modal>
                &times;
            </button>

            <div id="product-modal-body"></div>

        </section>
    `;

    document.body.appendChild(productModal);

    function openProductDetails(id) {

        const product = window.getProductById(id);

        if (!product) return;

        const body = document.getElementById("product-modal-body");

        body.innerHTML = `
            <div class="modal-product-layout">

                <div class="modal-product-image">
                    ${
                        product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : `<span class="medical-cross">＋</span>`
                    }
                </div>

                <div class="modal-product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h2>${product.name}</h2>

                    <div class="product-price">
                        ${window.formatPrice(product.price)}
                    </div>

                    <p>${product.description}</p>

                    <p class="modal-stock">
                        <strong>Availability:</strong>
                        ${product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    <p>
                        <strong>Available Quantity:</strong>
                        ${product.stock}
                    </p>

                    <label class="modal-quantity-label">
                        Quantity
                        <input
                            type="number"
                            id="modal-quantity"
                            min="1"
                            max="${product.stock}"
                            value="1">
                    </label>

                    <button class="btn modal-add-cart"
                        type="button"
                        data-add-cart="${product.id}"
                        ${product.stock <= 0 ? "disabled" : ""}>
                        Add to Cart
                    </button>

                </div>
            </div>

            <div class="product-modal-tabs">

                <button class="product-tab active"
                    data-product-tab="description">
                    Description
                </button>

                <button class="product-tab"
                    data-product-tab="details">
                    More Details
                </button>

                <button class="product-tab"
                    data-product-tab="reviews">
                    Reviews
                </button>

            </div>

            <div class="product-tab-content">

                <div class="product-tab-panel active"
                     id="tab-description">
                    <h3>Product Description</h3>
                    <p>${product.description}</p>
                </div>

                <div class="product-tab-panel"
                     id="tab-details">
                    <h3>Product Information</h3>
                    <p><strong>Product:</strong> ${product.name}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> ${window.formatPrice(product.price)}</p>
                    <p><strong>Available Stock:</strong> ${product.stock}</p>
                    <p><strong>Product ID:</strong> PC-${String(product.id).padStart(3, "0")}</p>
                </div>

                <div class="product-tab-panel"
                     id="tab-reviews">
                    <h3>Customer Reviews</h3>
                    <p class="no-reviews">
                        No customer reviews yet.
                        Be the first to share your experience with this product!
                    </p>
                </div>

            </div>
        `;

        productModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeProductDetails() {
        productModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    document.addEventListener("click", function(event) {

        const viewButton = event.target.closest("[data-view-product]");

        if (viewButton) {
            openProductDetails(Number(viewButton.dataset.viewProduct));
            return;
        }

        if (event.target.closest("[data-close-product-modal]")) {
            closeProductDetails();
            return;
        }

        const tabButton = event.target.closest("[data-product-tab]");

        if (tabButton) {

            const tab = tabButton.dataset.productTab;

            productModal.querySelectorAll(".product-tab").forEach(button => {
                button.classList.toggle("active", button === tabButton);
            });

            productModal.querySelectorAll(".product-tab-panel").forEach(panel => {
                panel.classList.toggle("active", panel.id === "tab-" + tab);
            });
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeProductDetails();
        }
    });


    // ======================================
    // FEATURED PRODUCTS
    // ======================================

    const featuredContainer =
        document.getElementById("featured-products");

    if (featuredContainer) {
        const featured = products.filter(product => product.featured);

        featuredContainer.innerHTML = featured
            .slice(0, 4)
            .map(createProductCard)
            .join("");
    }

    // ======================================
    // HOMEPAGE CATEGORIES
    // ======================================

    const categoryContainer =
        document.getElementById("home-categories");

    if (categoryContainer) {

        const categories = window.getProductCategories();

        const icons = {
            "Everyday Care": "✚",
            "Skin Care": "✿",
            "Protection": "◈",
            "Wound Care": "＋",
            "Family Care": "♡"
        };

        categoryContainer.innerHTML = categories.map(category => `
            <a class="category-card"
               href="shop.html?category=${encodeURIComponent(category)}">

                <div class="category-icon">
                    ${icons[category] || "✚"}
                </div>

                <h3>${category}</h3>

                <p>Explore our ${category.toLowerCase()} collection.</p>

            </a>
        `).join("");
    }

    // ======================================
    // SHOP PAGE
    // ======================================

    const shopContainer =
        document.getElementById("shop-products");

    if (shopContainer) {

        const searchInput =
            document.getElementById("product-search");

        const categoryFilter =
            document.getElementById("category-filter");

        const sortFilter =
            document.getElementById("sort-filter");

        const resultsCount =
            document.getElementById("results-count");

        const emptyState =
            document.getElementById("empty-state");

        const clearButton =
            document.getElementById("clear-filters");

        window.getProductCategories().forEach(category => {
            const option = document.createElement("option");

            option.value = category;
            option.textContent = category;

            categoryFilter.appendChild(option);
        });

        const params = new URLSearchParams(location.search);

        const selectedCategory = params.get("category");
        const selectedSort = params.get("sort");

        if (selectedCategory) {
            categoryFilter.value = selectedCategory;
        }

        if (selectedSort) {
            sortFilter.value = selectedSort;
        }

        function renderShop() {

            const search = searchInput.value.toLowerCase().trim();
            const category = categoryFilter.value;
            const sort = sortFilter.value;

            let filtered = products.filter(product => {

                const matchesSearch =
                    product.name.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search) ||
                    product.category.toLowerCase().includes(search);

                const matchesCategory =
                    !category || product.category === category;

                return matchesSearch && matchesCategory;
            });

            if (sort === "price-low") {
                filtered.sort((a, b) => a.price - b.price);
            }

            if (sort === "price-high") {
                filtered.sort((a, b) => b.price - a.price);
            }

            if (sort === "name") {
                filtered.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            }

            shopContainer.innerHTML =
                filtered.map(createProductCard).join("");

            resultsCount.textContent =
                `${filtered.length} product(s) found`;

            emptyState.classList.toggle(
                "hidden",
                filtered.length !== 0
            );
        }

        searchInput.addEventListener("input", renderShop);
        categoryFilter.addEventListener("change", renderShop);
        sortFilter.addEventListener("change", renderShop);

        clearButton.addEventListener("click", function () {
            searchInput.value = "";
            categoryFilter.value = "";
            sortFilter.value = "";
            renderShop();
        });

        renderShop();
    }

    // ======================================
    // PRODUCT DETAILS PAGE
    // ======================================

    const detailContainer =
        document.getElementById("product-detail");

    if (detailContainer) {

        const productId =
            new URLSearchParams(location.search).get("id");

        const product =
            window.getProductById(productId);

        if (!product) {

            detailContainer.innerHTML = `
                <div class="empty-content">
                    <h3>Product not found</h3>
                    <p>The product you are looking for is unavailable.</p>
                    <a href="shop.html" class="btn">Back to Shop</a>
                </div>
            `;

        } else {

            detailContainer.innerHTML = `
                <div class="product-detail-layout">

                    <div class="product-detail-image">
                        ${
                            product.image
                            ? `<img src="${product.image}" alt="${product.name}">`
                            : `<span class="medical-cross">＋</span>`
                        }
                    </div>

                    <div class="product-detail-info">

                        <span class="eyebrow">
                            ${product.category}
                        </span>

                        <h1>${product.name}</h1>

                        <p>${product.description}</p>

                        <div class="detail-price">
                            ${window.formatPrice(product.price)}
                        </div>

                        <p>Available stock: ${product.stock}</p>

                        <label>
                            Quantity
                            <input
                                class="quantity-input"
                                id="detail-quantity"
                                type="number"
                                min="1"
                                max="${product.stock}"
                                value="1">
                        </label>

                        <button
                            class="btn"
                            type="button"
                            data-add-cart="${product.id}">
                            Add to Cart
                        </button>

                        <a href="shop.html" class="btn btn-light">
                            Continue Shopping
                        </a>

                    </div>

                </div>
            `;
        }
    }

    // ======================================
    // ADD TO CART
    // ======================================

    document.addEventListener("click", function (event) {

        const button = event.target.closest("[data-add-cart]");

        if (!button) return;

        const id = Number(button.dataset.addCart);
        const product = window.getProductById(id);

        if (!product) return;

        const detailQuantity =
    document.getElementById("detail-quantity");

const modalQuantity =
    document.getElementById("modal-quantity");

const quantityInput = modalQuantity || detailQuantity;

const quantity = quantityInput
    ? Number(quantityInput.value)
    : 1;

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > product.stock
        ) {
            alert("Please enter a valid quantity.");
            return;
        }

        let cart = JSON.parse(
            localStorage.getItem("patchcare_cart") || "[]"
        );

        const existing = cart.find(item => item.id === id);

        const newQuantity =
            (existing ? existing.quantity : 0) + quantity;

        if (newQuantity > product.stock) {
            alert("Not enough stock available.");
            return;
        }

        if (existing) {
            existing.quantity = newQuantity;
        } else {
            cart.push({
                id: id,
                quantity: quantity
            });
        }

        localStorage.setItem(
            "patchcare_cart",
            JSON.stringify(cart)
        );

        alert(product.name + " added to cart!");
    });

});
