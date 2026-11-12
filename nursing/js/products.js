
 // ==========================================
 // PATCHCARE - PRODUCT DATABASE
 // ==========================================

window.PATCHCARE_PRODUCTS = [
    {
        id: 1,
        name: "Kool Fever Cooling Patch",
        category: "Everyday Care",
        price: 149,
        description: "Cooling gel patch designed to provide a soothing cooling sensation during fever.",
        image: "assets/images/products/product-1.jfif",
        stock: 50,
        featured: true
    },
    {
        id: 2,
        name: "Kleenfant Cooling Gel Patch",
        category: "Skin Care",
        price: 199,
        description: "Gentle cooling gel patches for comfortable everyday cooling care.",
        image: "assets/images/products/product-2.jfif",
        stock: 35,
        featured: true
    },
    {
        id: 3,
        name: "ElboUB Silicone Scar Sheets",
        category: "Protection",
        price: 179,
        description: "Silicone scar sheets designed for scar care and skin protection.",
        image: "assets/images/products/product-3.jfif",
        stock: 40,
        featured: true
    },
    {
        id: 4,
        name: "WellActiv Menstrual Patch",
        category: "Wound Care",
        price: 229,
        description: "A wearable menstrual patch designed for personal comfort and care.",
        image: "assets/images/products/product-4.jfif",
        stock: 30,
        featured: true
    },
    {
        id: 5,
        name: "Decorative Adhesive Bandages",
        category: "Family Care",
        price: 249,
        description: "Colorful decorative adhesive bandages for everyday minor wound coverage.",
        image: "assets/images/products/product-5.jfif",
        stock: 25,
        featured: false
    },
    {
        id: 6,
        name: "BAND-AID Hydro Seal",
        category: "Everyday Care",
        price: 159,
        description: "Hydrocolloid bandages designed to protect minor wounds and support healing.",
        image: "assets/images/products/product-6.jfif",
        stock: 45,
        featured: false
    },
    {
        id: 7,
        name: "TUORen IV Fixation Dressing",
        category: "Skin Care",
        price: 289,
        description: "Transparent IV fixation dressing designed to help secure medical devices.",
        image: "assets/images/products/product-7.jfif",
        stock: 20,
        featured: false
    },
    {
        id: 8,
        name: "SteadyTemp Wireless Thermometer Patch",
        category: "Wound Care",
        price: 199,
        description: "A wearable wireless thermometer patch for continuous temperature monitoring.",
        image: "assets/images/products/product-8.jfif",
        stock: 30,
        featured: false
    }
];

// ==========================================
// PRODUCT HELPERS
// ==========================================

window.getProductById = function (id) {
    return window.PATCHCARE_PRODUCTS.find(
        product => product.id === Number(id)
    );
};

window.getProductCategories = function () {
    return [...new Set(
        window.PATCHCARE_PRODUCTS.map(product => product.category)
    )];
};

window.formatPrice = function (price) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(price);
};
