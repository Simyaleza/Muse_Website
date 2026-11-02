const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");
navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

// ==================== Menu Search ====================
const searchInput = document.getElementById("menu-search");

if (searchInput) {
  const menu = document.querySelector(".menu");
  const noResults = document.getElementById("no-results");
  const boxes = Array.from(menu.querySelectorAll(".box"));

  // Store original searchable text for each box
  boxes.forEach((box) => {
    const nameEl = box.querySelector(".name");
    const priceEl = box.querySelector(".price");
    box.dataset.searchText = (
      (nameEl ? nameEl.textContent : "") +
      " " +
      (priceEl ? priceEl.textContent : "")
    )
      .toLowerCase()
      .trim();
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    boxes.forEach((box) => {
      const matches = box.dataset.searchText.includes(query);
      box.classList.toggle("hidden", !matches);
      if (matches) visibleCount++;
    });

    // Show / hide the "no results" message
    noResults.classList.toggle("visible", visibleCount === 0);

    // Hide category headings when their next menu-cards row is empty
    menu.querySelectorAll("h2").forEach((h2) => {
      // Walk forward from the heading until the next h2
      let node = h2.nextElementSibling;
      let anyVisible = false;
      while (node && node.tagName !== "H2") {
        if (
          node.classList.contains("menu-cards") &&
          node.querySelector(".box:not(.hidden)")
        ) {
          anyVisible = true;
          break;
        }
        node = node.nextElementSibling;
      }
      h2.classList.toggle("hidden", !anyVisible);
    });
  });
}
