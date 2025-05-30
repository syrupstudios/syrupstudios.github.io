/* mobile menu */
let menu = document.querySelector("#menu-icon");
let navlist = document.querySelector(".navlist");

menu.onclick = () => {
  menu.classList.toggle("fa-xmark");
  navlist.classList.toggle("open");
};

/* loading screen & cookies */
const overlay = document.getElementById("loading-overlay");
const banner = document.getElementById("cookie-banner");
const accept = document.getElementById("accept-cookies");
const decline = document.getElementById("decline-cookies");
const cookieChoice = localStorage.getItem("cookieConsent");

document.body.style.overflow = "hidden";

window.addEventListener("load", () => {
  setTimeout(() => {
    overlay.style.opacity = "0";

    setTimeout(() => {
      overlay.style.display = "none";

      document.body.style.overflow = "";

      if (!cookieChoice) {
        setTimeout(() => banner.classList.add("show"), 500);
      }
    }, 500);
  }, 1000);

  accept.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.classList.remove("show");
  });

  decline.addEventListener("click", () => {
    banner.classList.remove("show");
  });
});
