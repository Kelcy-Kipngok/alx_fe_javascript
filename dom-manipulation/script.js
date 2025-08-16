// Initial quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");

// Populate category dropdown
function updateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Reset select (keep "all" option)
  categorySelect.innerHTML = '<option value="all">All</option>';
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Add new quote
function createAddQuoteForm() { 
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    updateCategories();
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initialize categories on load
updateCategories();
// ===== Storage Keys =====
const STORAGE_KEYS = {
  QUOTES: "dqg_quotes_v2",
  LAST_FILTER: "dqg_last_filter",
};

// ===== Default Quotes =====
const DEFAULT_QUOTES = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

let quotes = [];

// ===== DOM =====
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ===== Load/Save Quotes =====
function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
  if (!raw) return [...DEFAULT_QUOTES];
  try {
    return JSON.parse(raw);
  } catch {
    return [...DEFAULT_QUOTES];
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

// ===== Categories =====
function populateCategories() {
  const uniqueCats = [...new Set(quotes.map(q => q.category.trim()))].sort();
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  // Restore last filter from storage
  const savedFilter = localStorage.getItem(STORAGE_KEYS.LAST_FILTER) || "all";
  if ([...categoryFilter.options].some(opt => opt.value === savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}

// ===== Filtering =====
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem(STORAGE_KEYS.LAST_FILTER, selected);

  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter(q => q.category === selected);
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  // Show first (or random if you want)
  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = `"${filtered[randomIndex].text}" — ${filtered[randomIndex].category}`;
}

// ===== Show Random Quote (still works independently) =====
function showRandomQuote() {
  filterQuotes(); // just reuse filtering logic
}

// ===== Add New Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  const categorySelect  = document.getElementById("categorySelect");
const exportBtn       = document.getElementById("exportBtn");
const importInput     = document.getElementById("importFile");

  if (!text || !category) {
    alert("Please enter both text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added!");
}

// ===== Init =====
(function init() {
  quotes = loadQuotes();
  populateCategories();
  filterQuotes(); // show filtered quotes on load

  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
})();


// ===== Helpers: Storage =====
function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (!raw) return [...DEFAULT_QUOTES];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_QUOTES];
  } catch {
    return [...DEFAULT_QUOTES];
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

function saveLastViewedQuoteSession(quoteObj) {
  sessionStorage.setItem(STORAGE_KEYS.LAST_QUOTE, JSON.stringify(quoteObj));
}

function getLastViewedQuoteSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.LAST_QUOTE);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSelectedCategorySession(cat) {
  sessionStorage.setItem(STORAGE_KEYS.LAST_CATEGORY, cat);
}

function getSelectedCategorySession() {
  return sessionStorage.getItem(STORAGE_KEYS.LAST_CATEGORY) || "all";
}

// ===== UI: Categories =====
function updateCategories() {
  const selectedBefore = categorySelect.value || "all";
  const categories = [...new Set(quotes.map(q => q.category.trim()))].sort((a, b) => a.localeCompare(b));

  categorySelect.innerHTML = '<option value="all">All</option>';
  for (const cat of categories) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }

  // Restore last selected (session)
  const remembered = getSelectedCategorySession();
  categorySelect.value = categories.includes(remembered) || remembered === "all"
    ? remembered
    : "all";

  // If that failed, try previous value
  if (!categorySelect.value) {
    categorySelect.value = categories.includes(selectedBefore) ? selectedBefore : "all";
  }
}

// ===== UI: Quotes =====
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let pool = quotes;

  if (selectedCategory !== "all") {
    pool = quotes.filter(q => q.category === selectedCategory);
  }

  if (pool.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  const q = pool[idx];

  // Use textContent to avoid any HTML injection
  quoteDisplay.textContent = `"${q.text}" — ${q.category}`;

  // Session storage demo: remember last viewed quote and category
  saveLastViewedQuoteSession(q);
  saveSelectedCategorySession(selectedCategory);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Optional: Prevent exact duplicates (text+category, case-insensitive)
  const key = (s) => s.toLowerCase();
  const exists = quotes.some(q => key(q.text) === key(text) && key(q.category) === key(category));
  if (exists) {
    alert("That quote already exists in this category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategories();

  // Reset inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
}
application/json", "Blob
  FileReader", "onload", "readAsText
// ===== JSON: Export / Import
