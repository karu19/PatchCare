# PatchCare demo storefront

A responsive, multi-page e-commerce frontend built with HTML, CSS, and vanilla JavaScript.

## Run it
Open `index.html` in a browser. For best results, use a simple local server (for example VS Code Live Server).

## Add your product photos
1. Put each product photo in `assets/images/products/`.
2. Open `js/products.js`.
3. Change the matching `image` value to your file name/path.
4. Product image containers use `object-fit: contain`; missing photos display a placeholder.

## Important demo limitations
- Cart, sample accounts, and sample orders are stored in browser `localStorage`.
- Login is frontend-only and is NOT secure authentication.
- Checkout is simulated; it does not process payments, shipping, or delivery.
- Prices and descriptions are editable sample content. Verify actual product claims, pricing, and regulatory requirements before publishing.

## Pages
Home, Shop, Product Details, Cart, Checkout, Login, Sign Up, Profile, About, Contact.
