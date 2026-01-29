const CATEGORY_MAP = {
  "#pasta": "Pasta",
  "#pizza": "Beef",         
  "#sandwiches": "Miscellaneous",
  "#appetizers": "Starter", 
  "#sweets": "Dessert"
};


// Elements
const homeWrapper = document.getElementById("home");
const landing = document.querySelector(".landing");
const navbar = document.querySelector(".navbar");
let menuSection = null;

// Create menu section once
function createMenuSectionOnce(categoryName = "") {
  if (!menuSection) {
    menuSection = document.createElement("section");
    menuSection.id = "menuSection";
    menuSection.className = "py-5";
    menuSection.innerHTML = `
      <div class="container">
        <h2 id="categoryTitle" class="custom-underlines mb-4 text-center"></h2>
        <div id="cardsContainer" class="row g-4 text-center"></div>
      </div>
    `;
    homeWrapper.insertAdjacentElement("afterend", menuSection);
  }
  document.getElementById("categoryTitle").textContent = categoryName;
  return menuSection;
}

// Fetch meals by category
async function fetchMealsByCategory(apiCategory) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = `<div class="col-12 py-5 text-center">
    <div class="spinner-border" role="status"></div>
    <div class="mt-2">Loading...</div>
  </div>`;
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(apiCategory)}`);
    const data = await res.json();
    const meals = data?.meals || [];
    if (!meals.length) {
      cardsContainer.innerHTML = `<p class="text-muted">No items found for this category.</p>`;
      return;
    }
    const cardsHTML = meals.slice(0, 12).map(meal => `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h6 class="card-title mb-0">${meal.strMeal}</h6>
          </div>
        </div>
      </div>
    `).join("");
    cardsContainer.innerHTML = cardsHTML;
  } catch (err) {
    cardsContainer.innerHTML = `<p class="text-danger">Failed to load items. Please try again.</p>`;
    console.error(err);
  }
}

// Navbar links click
document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const href = link.getAttribute("href");

    if (href === "#home") {
      // Home page
      landing.classList.remove("d-none");
      if (menuSection) menuSection.classList.add("d-none");

      // Navbar transparent
      navbar.classList.remove("fixed-brown");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const apiCategory = CATEGORY_MAP[href];
    if (!apiCategory) return;

    // Menu section
    createMenuSectionOnce(apiCategory);
    landing.classList.add("d-none");
    menuSection.classList.remove("d-none");

    // Navbar brown
    navbar.classList.add("fixed-brown");

    fetchMealsByCategory(apiCategory);
    menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Navbar scroll effect (only on home)
window.addEventListener("scroll", () => {
  if (!landing.classList.contains("d-none")) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      preloader.style.display = "none";
    }, 500); 
  }, 1500); 
});
window.addEventListener("load", () => {
  const apiCategory = CATEGORY_MAP["#pasta"];
  const pizzaSection = createMenuSectionOnce(apiCategory);
  pizzaSection.classList.remove("d-none");  
  fetchMealsByCategory(apiCategory);
});
