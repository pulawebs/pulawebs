/* =========================================================
   MOTSWANA KITCHEN — SCRIPT.JS
   Handles: menu data/rendering, filtering, cart/order logic,
   quantity changes, totals, form validation, mobile nav,
   smooth scroll, toast messages, and success confirmation.
   ========================================================= */

/* ---------- 1. MENU DATA ---------- */
// Each food item has: id, name, description, price (BWP), category, image
const menuItems = [
  {
    id: "seswaa",
    name: "Seswaa",
    description: "Slow-cooked, pounded beef seasoned simply with salt — a Botswana classic.",
    price: 65,
    category: "meat",
    image: "https://placehold.co/400x300/1f5aa6/f7f3ea?text=Seswaa"
  },
  {
    id: "bogobe",
    name: "Bogobe",
    description: "Traditional sorghum or maize porridge, soft and comforting.",
    price: 30,
    category: "traditional",
    image: "https://placehold.co/400x300/c88a2c/1a1a1a?text=Bogobe"
  },
  {
    id: "morogo",
    name: "Morogo",
    description: "Wild spinach cooked with tomato and onion — a nutritious side dish.",
    price: 25,
    category: "sides",
    image: "https://placehold.co/400x300/1a1a1a/f7f3ea?text=Morogo"
  },
  {
    id: "vetkoek",
    name: "Vetkoek",
    description: "Golden, fluffy fried bread — delicious on its own or filled with mince.",
    price: 20,
    category: "snacks",
    image: "https://placehold.co/400x300/c88a2c/1a1a1a?text=Vetkoek"
  },
  {
    id: "dikgobe",
    name: "Dikgobe",
    description: "Hearty mix of samp, beans, and sorghum — a wholesome traditional favourite.",
    price: 35,
    category: "traditional",
    image: "https://placehold.co/400x300/1f5aa6/f7f3ea?text=Dikgobe"
  },
  {
    id: "phane",
    name: "Phane",
    description: "Mopane worms cooked with onion and tomato — a true Botswana delicacy.",
    price: 55,
    category: "traditional",
    image: "https://placehold.co/400x300/1a1a1a/f7f3ea?text=Phane"
  },
  {
    id: "trad-chicken",
    name: "Traditional Chicken",
    description: "Free-range chicken slow-cooked in a rich, traditional Setswana style.",
    price: 60,
    category: "meat",
    image: "https://placehold.co/400x300/c88a2c/1a1a1a?text=Traditional+Chicken"
  },
  {
    id: "beef-stew",
    name: "Beef Stew",
    description: "Tender beef simmered in a savoury tomato and vegetable stew.",
    price: 58,
    category: "meat",
    image: "https://placehold.co/400x300/1f5aa6/f7f3ea?text=Beef+Stew"
  }
];

/* ---------- 2. STATE ---------- */
// The cart holds { id, name, price, qty } for each item the customer added
let cart = [];

/* ---------- 3. DOM REFERENCES ---------- */
const menuGrid = document.getElementById("menuGrid");
const menuFilters = document.getElementById("menuFilters");
const foodSelect = document.getElementById("foodSelect");
const foodQty = document.getElementById("foodQty");
const addOrderBtn = document.getElementById("addOrderBtn");
const orderSummary = document.getElementById("orderSummary");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const orderTotalEl = document.getElementById("orderTotal");
const orderForm = document.getElementById("orderForm");
const orderSuccess = document.getElementById("orderSuccess");
const toast = document.getElementById("toast");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const navbar = document.getElementById("navbar");

/* =========================================================
   4. RENDER MENU CARDS
   ========================================================= */
function formatPrice(amount) {
  // Formats a number as Botswana Pula, e.g. 65 -> "P65.00"
  return "P" + amount.toFixed(2);
}

function renderMenu(filter = "all") {
  menuGrid.innerHTML = "";

  const itemsToShow =
    filter === "all" ? menuItems : menuItems.filter((item) => item.category === filter);

  itemsToShow.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="menu-card-img">
        <img src="${item.image}" alt="${item.name}">
        <span class="menu-card-tag">${item.category}</span>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-title">${item.name}</h3>
        <p class="menu-card-desc">${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatPrice(item.price)}</span>
          <button class="add-order-btn" data-id="${item.id}">Add to Order</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

/* Populate the <select> dropdown in the Order section with all food items */
function populateFoodSelect() {
  foodSelect.innerHTML = "";
  menuItems.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} — ${formatPrice(item.price)}`;
    foodSelect.appendChild(option);
  });
}

/* =========================================================
   5. MENU FILTERING
   ========================================================= */
menuFilters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  // Update active button styling
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  renderMenu(btn.dataset.filter);
});

/* =========================================================
   6. CART LOGIC
   ========================================================= */
function addToCart(id, qty = 1) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;

  qty = Math.max(1, parseInt(qty) || 1);

  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: qty });
  }

  renderCart();
  showToast(`${item.name} added to your order!`);
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
  }
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  orderSummary.innerHTML = "";

  if (cart.length === 0) {
    orderSummary.appendChild(emptyCartMsg);
    orderTotalEl.textContent = formatPrice(0);
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "order-item";
    row.innerHTML = `
      <div class="order-item-info">
        <h5>${item.name}</h5>
        <span>${formatPrice(item.price)} each</span>
      </div>
      <div class="order-item-controls">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        <span class="order-item-qty">${item.qty}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">🗑️</button>
      </div>
    `;
    orderSummary.appendChild(row);
  });

  orderTotalEl.textContent = formatPrice(calculateTotal());
}

/* Handle clicks inside the order summary (increase / decrease / remove) */
orderSummary.addEventListener("click", (e) => {
  const qtyBtn = e.target.closest(".qty-btn");
  const removeBtn = e.target.closest(".remove-item-btn");

  if (qtyBtn) {
    const id = qtyBtn.dataset.id;
    const delta = qtyBtn.dataset.action === "increase" ? 1 : -1;
    changeQty(id, delta);
  }

  if (removeBtn) {
    removeFromCart(removeBtn.dataset.id);
  }
});

/* "Add to Order" buttons on menu cards (event delegation since cards are dynamic) */
menuGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-order-btn");
  if (!btn) return;

  addToCart(btn.dataset.id, 1);

  // Quick visual feedback on the button itself
  btn.classList.add("added");
  btn.textContent = "Added ✓";
  setTimeout(() => {
    btn.classList.remove("added");
    btn.textContent = "Add to Order";
  }, 1200);
});

/* "Add" button in the Order section (select + quantity) */
addOrderBtn.addEventListener("click", () => {
  addToCart(foodSelect.value, foodQty.value);
  foodQty.value = 1;
});

/* =========================================================
   7. TOAST NOTIFICATIONS
   ========================================================= */
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* =========================================================
   8. ORDER FORM VALIDATION & SUBMISSION
   ========================================================= */
function validateForm() {
  let isValid = true;

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const addressInput = document.getElementById("customerAddress");
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const addressError = document.getElementById("addressError");

  // Reset previous error states
  [nameInput, phoneInput, addressInput].forEach((el) => el.classList.remove("input-error"));
  nameError.textContent = "";
  phoneError.textContent = "";
  addressError.textContent = "";

  // Cart must not be empty
  if (cart.length === 0) {
    showToast("Please add at least one item to your order.");
    isValid = false;
  }

  // Name: required, at least 2 characters
  if (nameInput.value.trim().length < 2) {
    nameError.textContent = "Please enter your full name.";
    nameInput.classList.add("input-error");
    isValid = false;
  }

  // Phone: required, basic pattern check (digits, spaces, +, 7-15 chars)
  const phonePattern = /^[0-9+\s]{7,15}$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    phoneError.textContent = "Please enter a valid phone number.";
    phoneInput.classList.add("input-error");
    isValid = false;
  }

  // Address required only for delivery
  if (deliveryType === "delivery" && addressInput.value.trim().length < 5) {
    addressError.textContent = "Please provide a delivery address.";
    addressInput.classList.add("input-error");
    isValid = false;
  }

  return isValid;
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // In a real business, this data would be sent to a server / WhatsApp API / email.
  // For now we simply show a success message, as requested.
  const orderData = {
    customer: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    deliveryType: document.querySelector('input[name="deliveryType"]:checked').value,
    address: document.getElementById("customerAddress").value.trim(),
    items: [...cart],
    total: calculateTotal()
  };

  console.log("New order submitted:", orderData); // Placeholder for future backend integration

  // Show success message, hide the form
  orderForm.style.display = "none";
  orderSuccess.classList.add("show");

  // Reset cart & form after a short delay so the user can read the message
  setTimeout(() => {
    cart = [];
    renderCart();
    orderForm.reset();
    orderForm.style.display = "block";
    orderSuccess.classList.remove("show");
  }, 6000);

  // Scroll the success message into view smoothly
  orderSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* =========================================================
   9. MOBILE NAVIGATION
   ========================================================= */
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
});

// Close the mobile menu whenever a nav link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

/* =========================================================
   10. SMOOTH SCROLL + ACTIVE LINK HIGHLIGHTING
   ========================================================= */
// Smooth scroll is already enabled via CSS `scroll-behavior: smooth`,
// but we also handle it in JS for older browsers and to account for navbar height.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length <= 1) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  });
});

// Highlight the current section's nav link while scrolling
const sections = document.querySelectorAll("section[id]");
function updateActiveLink() {
  let current = "home";
  const scrollPos = window.scrollY + navbar.offsetHeight + 40;

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active-link", link.getAttribute("href") === `#${current}`);
  });
}

/* =========================================================
   11. SCROLL EVENTS: navbar shadow, back-to-top, reveal animations
   ========================================================= */
function handleScroll() {
  updateActiveLink();

  // Show/hide back-to-top button
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }

  // Reveal elements as they enter the viewport
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", handleScroll);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   12. ADD "reveal" CLASS TO KEY ELEMENTS FOR SCROLL ANIMATION
   ========================================================= */
function initRevealAnimations() {
  const targets = document.querySelectorAll(
    ".menu-card, .why-card, .review-card, .gallery-item, .highlight-item"
  );
  targets.forEach((el) => el.classList.add("reveal"));
}

/* =========================================================
   13. INIT
   ========================================================= */
function init() {
  renderMenu("all");
  populateFoodSelect();
  renderCart();
  initRevealAnimations();
  handleScroll(); // run once on load

  // Set footer copyright year automatically
  document.getElementById("currentYear").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);

