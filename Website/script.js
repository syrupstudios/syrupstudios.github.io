document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, 0);

  // Parallax Effect Elements
  const headerBackdrop = document.querySelector(".backdrop");
  const title = document.querySelector(".title");
  const clouds = document.querySelector("img.Clouds");
  const sun = document.querySelector("img.Sun");
  const mount2 = document.querySelector("img.Mount2");
  const mount3 = document.querySelector("img.Mount3");
  const mount4 = document.querySelector("img.Mount4");

  // Dropdown Menu Elements
  const toggleBtn = document.querySelector(".toggle__btn");
  const toggleBtnIcon = document.querySelector(".toggle__btn i");
  const dropDownMenu = document.querySelector(".dropdown_menu");

  function updateParallax() {
    let value = window.scrollY;

    // Parallax effects
    title.style.marginTop = value * 2 + "px";

    clouds.style.marginLeft = -value + "px";
    sun.style.marginLeft = value + "px";

    mount2.style.marginBottom = -value * 1.1 + "px";
    mount3.style.marginBottom = -value * 1.2 + "px";
    mount4.style.marginBottom = -value * 1.3 + "px";

    // Header background transition
    if (value > 0) {
      headerBackdrop.classList.add("scrolled");
    } else {
      headerBackdrop.classList.remove("scrolled");
    }
  }

  function toggleDropdown() {
    dropDownMenu.classList.toggle("open");
    const isOpen = dropDownMenu.classList.contains("open");

    toggleBtnIcon.classList = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  updateParallax();

  window.addEventListener("scroll", updateParallax);
  toggleBtn.addEventListener("click", toggleDropdown);
});
