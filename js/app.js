// ===== Supabase connection =====
const SUPABASE_URL = "https://oteufegnegyslayjblwl.supabase.co";
const SUPABASE_KEY = "sb_publishable_3KnxyT13IZF0wzW-Vef1Bw_MEVf31hj";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// سيتم تحميل المنتجات من قاعدة البيانات
let products = [];

// ===== Display products =====
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }

  list.forEach((product) => {
    const stock = Number(product.stock) || 0;

    const stockLabel = stock === 0
      ? "Out of Stock"
      : stock <= 5
        ? "Low Stock"
        : "In Stock";

    const stockClass = stock === 0
      ? "out"
      : stock <= 5
        ? "low"
        : "in";

    container.innerHTML += `
      <article class="product">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>AED ${Number(product.price).toLocaleString()}</p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <a href="product-detail.html?id=${encodeURIComponent(product.id)}">
          View details
        </a>
        <button type="button" ${stock === 0 ? "disabled" : ""}>
          Add to Cart
        </button>
      </article>`;
  });
}

// ===== Search, category filter, and sorting =====
let currentCategory = "All";

function applyFilters() {
  const searchTerm = document
    .getElementById("search-box")
    .value
    .toLowerCase()
    .trim();

  const sortValue = document.getElementById("sort-select").value;

  let filteredProducts = currentCategory === "All"
    ? [...products]
    : products.filter(
        (product) => product.category === currentCategory
      );

  filteredProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );

  if (sortValue === "low-high") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  } else if (sortValue === "high-low") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  renderProducts(filteredProducts);
}

// Search
document
  .getElementById("search-box")
  .addEventListener("input", applyFilters);

// Filter by category
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    document.querySelectorAll(".category-btn").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    applyFilters();
  });
});

// Sort by price
document
  .getElementById("sort-select")
  .addEventListener("change", applyFilters);

// ===== Fetch products from Supabase =====
async function loadProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "<p>Loading products...</p>";

  const { data, error } = await supabase
    .from("product")
    .select("*, category(category_name)")
    .order("name");

  if (error) {
    container.innerHTML =
      `<p>Could not load products: ${error.message}</p>`;
    return;
  }

  products = data.map((item) => ({
    id: item.product_id,
    name: item.name,
    category: item.category?.category_name ?? "Uncategorized",
    price: item.price,
    stock: item.stock
  }));

  applyFilters();
}

loadProducts();
