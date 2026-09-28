// ===== Part A: Product data =====
const products = [
  { id: 1,  name: "Business Laptop",      category: "Computers",   price: 3499, stock: 10, image: "images/laptop.jpg" },
  { id: 2,  name: "Wireless Headphones",  category: "Accessories", price: 299,  stock: 0,  image: "images/headphones.jpg" },
  { id: 3,  name: "Mechanical Keyboard",  category: "Accessories", price: 249,  stock: 12, image: "images/keyboard.jpg" },
  { id: 4,  name: "Wireless Mouse",       category: "Accessories", price: 99,   stock: 25, image: "images/mouse.jpg" },
  { id: 5,  name: "24-inch Monitor",      category: "Accessories", price: 699,  stock: 4,  image: "images/monitor.jpg" },
  { id: 6,  name: "HD Webcam",            category: "Accessories", price: 179,  stock: 2,  image: "images/webcam.jpg" },
  { id: 7,  name: "HP Pavilion Laptop",   category: "Computers",   price: 2899, stock: 6 },
  { id: 8,  name: "MacBook Air",          category: "Computers",   price: 4299, stock: 0 },
  { id: 9,  name: "Lenovo Desktop PC",    category: "Computers",   price: 2199, stock: 7 },
  { id: 10, name: "Asus Gaming Laptop",   category: "Computers",   price: 5199, stock: 3 },
  { id: 11, name: "Smartphone",           category: "Phones",      price: 2499, stock: 0 },
  { id: 12, name: "iPhone 15",            category: "Phones",      price: 3399, stock: 15 },
  { id: 13, name: "Samsung Galaxy S24",   category: "Phones",      price: 3199, stock: 5 },
  { id: 14, name: "Google Pixel 8",       category: "Phones",      price: 2599, stock: 9 },
  { id: 15, name: "Xiaomi Redmi Note 13", category: "Phones",      price: 899,  stock: 20 }
];

// ===== Part B: Render function =====
   function renderProducts(list) {
      const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }

  list.forEach(prod => {
    const stockLabel = prod.stock === 0 ? "Out of Stock"
      : prod.stock <= 5 ? "Low Stock" : "In Stock";

    const stockClass = prod.stock === 0 ? "out"
      : prod.stock <= 5 ? "low" : "in";

    container.innerHTML += `
      <article class="product">
        ${prod.image ? `<img src="${prod.image}" alt="${prod.name}">` : ""}
        <h3>${prod.name}</h3>
        <p>${prod.category}</p>
        <p>AED ${prod.price.toLocaleString()}</p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <button type="button" ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </article>`;
  });
}

// ===== Part C + Challenge: search, filter and sort combined =====
let currentCategory = "All";

function applyFilters() {
  const term = document.getElementById("search-box").value.toLowerCase();
  const sortValue = document.getElementById("sort-select").value;

  // 1) filter by category
  let result = currentCategory === "All"
    ? [...products]
    : products.filter(p => p.category === currentCategory);

  // 2) filter by search term
  result = result.filter(p => p.name.toLowerCase().includes(term));

  // 3) sort (on a copy, never the original array)
  if (sortValue === "low-high") result.sort((a, b) => a.price - b.price);
  if (sortValue === "high-low") result.sort((a, b) => b.price - a.price);

  renderProducts(result);
}

// Search box
document.getElementById("search-box").addEventListener("input", applyFilters);

// Category buttons
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

// Sort select
document.getElementById("sort-select").addEventListener("change", applyFilters);

// First render
renderProducts(products);
