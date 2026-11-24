// ---------- Carousel ----------
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".carousel-dots");

let current = 0;
let timer;

// Build one dot per slide
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", "Go to slide " + (i + 1));
  dot.addEventListener("click", () => {
    goTo(i);
    restartAutoplay();
  });
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("button");

function goTo(index) {
  slides[current].classList.remove("is-active");
  dots[current].classList.remove("is-active");
  current = (index + slides.length) % slides.length; // wraps around at the ends
  slides[current].classList.add("is-active");
  dots[current].classList.add("is-active");
}

function restartAutoplay() {
  clearInterval(timer);
  timer = setInterval(() => goTo(current + 1), 5000); // change every 5 seconds
}

document.querySelector(".prev").addEventListener("click", () => {
  goTo(current - 1);
  restartAutoplay();
});
document.querySelector(".next").addEventListener("click", () => {
  goTo(current + 1);
  restartAutoplay();
});

goTo(0);            // show the first slide
restartAutoplay();  // start the automatic rotation