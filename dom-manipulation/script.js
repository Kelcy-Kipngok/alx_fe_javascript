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
  QUOTES: "dqg_quotes_sync",
  LAST_FILTER: "dqg_last_filter",
};

// ===== Defaults =====
const DEFAULT_QUOTES = [
  { id: 1, text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { id: 2, text: "Simplicity is the ultimate sophistication.", category: "Philosophy" },
  { id: 3, text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
];

let quotes = [];

// ===== DOM =====
const quoteDisplay   = document.getElementById("quoteDisplay");
const newQuoteBtn    = document.getElementById("newQuote");
const addQuoteBtn    = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Banner to show sync messages
const banner = document.createElement("div");
banner.id = "conflictBanner";
banner.style.cssText = "background: #ffd966; padding: 8px; margin: 8px 0; display:none;";
document.body.insertBefore(banner, quoteDisplay);

// ===== Storage =====
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

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const q = filtered[randomIndex];
  quoteDisplay.textContent = `"${q.text}" — ${q.category}`;
}

// ===== Show Random =====
function showRandomQuote() {
  filterQuotes();
}

// ===== Add New Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both text and category.");
    return;
  }

  const newQuote = { id: Date.now(), text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  // Sync to server (simulate POST)
  syncQuoteToServer(newQuote);

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added!");
}

// ===== Server Sync Simulation =====
async function fetchFromServer() {
  try {
    // Simulate GET from server
    const fetchQuotesFromServer = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await res.json();

    // Convert mock server data to quotes
    const Content-Type = serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: "Server"  // fake category since placeholder has none
    }));

    mergeServerQuotes(serverQuotes);
  } catch (err) {
    console.warn("Server fetch failed:", err);
  }
}

async function syncQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    console.log("Quote synced to server:", quote);
  } catch (err) {
    console.warn("Failed to sync new quote:", err);
  }
}

function syncQuotes(serverQuotes) {
  let conflicts = 0;
  const syncQuotes = new Map(quotes.map(q => [q.id, q]));

  serverQuotes.forEach(sq => {
    if (!localMap.has(sq.id)) {
      quotes.push(sq); // new from server
    } else {
      const local = localMap.get(sq.id);
      if (local.text !== sq.text || local.category !== sq.category) {
        // Conflict: server wins
        local.text = sq.text;
        local.category = sq.category;
        conflicts++;
      }
    }
  });

  if (conflicts > 0) {
    banner.textContent = `⚠️ ${conflicts} conflicts resolved using server data.`;
    banner.style.display = "block";
    setTimeout(() => banner.style.display = "none", 4000);
  }

  saveQuotes();
  populateCategories();
}

// ===== Init =====
(function init() {
  quotes = loadQuotes();
  populateCategories();
  filterQuotes();

  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);

  // Initial server sync
  fetchFromServer();

  // Periodic sync every 30s
  setInterval(fetchFromServer, 30000);
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
