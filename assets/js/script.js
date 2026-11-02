// ==================== Navbar Toggle ====================
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

    noResults.classList.toggle("visible", visibleCount === 0);

    menu.querySelectorAll("h2").forEach((h2) => {
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

// ==================== Enquiry Form: Validation + Simulated AJAX ====================
const enquiryForm = document.querySelector(".enquiry form");

if (enquiryForm) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = enquiryForm.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validators = {
    name: (value) => {
      const v = value.trim();
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      if (v.length > 60) return "Name must be under 60 characters.";
      return "";
    },
    email: (value) => {
      const v = value.trim();
      if (!v) return "Please enter your email.";
      if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address.";
      return "";
    },
    message: (value) => {
      const v = value.trim();
      if (!v) return "Please enter a message.";
      if (v.length < 10) return "Message must be at least 10 characters.";
      if (v.length > 1000) return "Message must be under 1000 characters.";
      return "";
    },
  };

  function setFieldError(input, message) {
    const existing = input.parentElement.querySelector(
      `.field-error[data-for="${input.id}"]`,
    );
    if (existing) existing.remove();

    input.classList.toggle("invalid", Boolean(message));

    if (message) {
      const errorEl = document.createElement("p");
      errorEl.className = "field-error";
      errorEl.dataset.for = input.id;
      errorEl.textContent = message;
      input.insertAdjacentElement("afterend", errorEl);
    }
  }

  function validateField(input) {
    const rule = validators[input.id];
    if (!rule) return true;
    const error = rule(input.value);
    setFieldError(input, error);
    return !error;
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid") && validateField(input)) {
        setFieldError(input, "");
      }
    });
  });

  let statusEl = null;
  function showStatus(type, text) {
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.className = "form-status";
      enquiryForm.appendChild(statusEl);
    }
    statusEl.className = `form-status ${type}`;
    statusEl.textContent = text;
  }

  function clearStatus() {
    if (statusEl) {
      statusEl.remove();
      statusEl = null;
    }
  }

  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearStatus();

    const fields = [nameInput, emailInput, messageInput].filter(Boolean);
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      const firstInvalid = fields.find((f) => f.classList.contains("invalid"));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulated AJAX request (no real server needed)
    setTimeout(() => {
      showStatus(
        "success",
        "Thank you! Your enquiry has been sent. We will get back to you soon.",
      );
      enquiryForm.reset();
      fields.forEach((f) => setFieldError(f, ""));
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 1200);
  });
}
