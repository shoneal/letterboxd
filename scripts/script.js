const films = {
  2025: {
    "Black Bag": ["2025-03-14", 2],
    Warfare: ["2025-04-10", 2],
    "Thunderbolts*": ["2025-05-01", 5],
    Materialists: ["2025-06-19", 6],
    Weapons: ["2025-08-08", 2],
    "Caught Stealing": ["2025-08-29", 6],
    "One Battle After Another": ["2025-09-26", 6],
    Nonnas: ["2025-05-09", 5],
    "Wake Up Dead Man": ["2025-12-12", 6],
  },
  2024: {
    "Orion and the Dark": ["2024-02-02", 5],
    "Dune: Part Two": ["2024-02-28", 5],
    "Arthur the King": ["2024-04-04", 5],
    "Furiosa: A Mad Max Saga": ["2024-05-23", 5],
    Challengers: ["2024-04-24", 5],
    "Deadpool & Wolverine": ["2024-07-25", 5],
    "Alien: Romulus": ["2024-08-15", 5],
    "The Wild Robot": ["2024-09-27", 5],
    Flow: ["2024-08-29", 5],
    "Paddington in Peru": ["2024-11-28", 5],
    Nosferatu: ["2024-12-25", 5],
  },
}; // Главный объект

for (const section in films) {
  films[section] = Object.fromEntries(
    Object.entries(films[section]).sort(([, [dateA]], [, [dateB]]) =>
      dateB.localeCompare(dateA)
    )
  );
} // Сортировка по дате

const basicLink = "https://shoneal.github.io/letterboxd/images/"; // Главная ссылка

const navigation = document.querySelector(".navigation");
const subnavigation = document.querySelector(".subnavigation");
const mainLink = navigation.querySelector(".has-icon");
function populateNavigation() {
  const years = Object.keys(films)
    .map(Number)
    .sort((a, b) => b - a);
  let isFirstAddedItem = true;

  years.forEach((year) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = year;
    if (isFirstAddedItem) {
      li.className = "selected";
      mainLink.firstChild.textContent = year;
      isFirstAddedItem = false;
    }
    li.appendChild(link);
    subnavigation.appendChild(li);
  });
} // Добавление навигации в HTML

const isLarge = () => window.innerWidth >= 768;
const show = () => (subnavigation.style.display = "block"); // Открытие навигации
const hide = () => (subnavigation.style.display = "none"); // Закрытие навигации

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
} // Названия в соответсвующий вид
const popup = document.querySelector(".popup");
function updateUI(year) {
  const data = films[year];
  if (!data) return;

  const titles = Object.keys(data);
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomNum = Math.floor(Math.random() * data[randomTitle][1]) + 1;

  const backdropContainer = document.querySelector(".backdrop-container");
  const backdrop = backdropContainer.querySelector(".backdropimage");
  backdropContainer.style.opacity = "0";
  backdrop.src = `${basicLink}backdrop/${year}/${toSlug(
    randomTitle
  )}/${randomNum}.jpg`;
  backdrop.alt = `"${randomTitle}" Shot`;
  if (backdrop.complete) {
    backdropContainer.style.opacity = "1";
  } else {
    backdrop.addEventListener(
      "load",
      () => (backdropContainer.style.opacity = "1")
    );
    backdrop.addEventListener(
      "error",
      () => (backdropContainer.style.opacity = "1")
    );
  }

  document.querySelector(
    ".backdrop-metadata"
  ).textContent = `${randomTitle} (${year})`;

  const posterList = document.querySelector(".poster-list");
  posterList.innerHTML = "";
  Object.keys(data).forEach((title) => {
    const li = document.createElement("li");
    li.className = "poster-item";
    li.title = `${title} (${year})`;

    const img = document.createElement("img");
    const alt = `"${title}" Poster`;
    img.style.opacity = "0";
    img.alt = alt;
    img.src = `${basicLink}posters/thumb/${year}/${toSlug(title)}.jpg`;

    if (img.complete) {
      img.style.opacity = "1";
    } else {
      img.addEventListener("load", () => (img.style.opacity = "1"));
      img.addEventListener("error", () => (img.style.opacity = "1"));
    }

    li.appendChild(img);
    posterList.appendChild(li);

    li.addEventListener("click", (e) => {
      const posterImage = popup.querySelector(".poster-image");

      posterImage.src = `${basicLink}posters/full/${year}/${toSlug(title)}.jpg`;
      posterImage.alt = alt;

      openPopup(popup);
      e.stopPropagation();
    }); // Клик по постеру и открытии попапа
  });
} // Обновление списка постеров и главной картинки

const openPopup = (popup) => {
  const body = document.body;
  const scrollPosition = window.scrollY;
  body.dataset.scrollPosition = scrollPosition;
  body.style.top = `-${scrollPosition}px`;
  body.classList.add("scroll-lock");
  popup.classList.add("popup_is-opened");
  popup
    .querySelector(".popup-content")
    .classList.add("popup-content_is-opened");
  document.addEventListener("keydown", closePopupByEsc);
}; // Открытие popup
const closePopup = (popup) => {
  const body = document.body;
  const scrollPosition = body.dataset.scrollPosition;
  body.style.top = "";
  body.classList.remove("scroll-lock");
  window.scrollTo(0, scrollPosition);
  popup.classList.remove("popup_is-opened");
  popup
    .querySelector(".popup-content")
    .classList.remove("popup-content_is-opened");
  popup.querySelector("img").src = "";
  document.removeEventListener("keydown", closePopupByEsc);
}; // Закрытие popup
const closePopupByEsc = (e) =>
  e.key === "Escape" && closePopup(document.querySelector(".popup_is-opened")); // Закрытие popup по Esc

document.addEventListener("DOMContentLoaded", function () {
  populateNavigation();

  navigation.addEventListener("click", (e) => {
    if (isLarge()) return;
    e.stopPropagation();
    subnavigation.style.display === "block" ? hide() : show();
  });

  subnavigation.addEventListener("click", (e) => {
    const clickedLi = e.target.closest("li");
    if (!clickedLi) return;
    const link = clickedLi.querySelector("a");
    if (!link || link.classList.contains("has-icon")) return;

    document.querySelectorAll(".subnavigation .selected").forEach((el) => {
      el.classList.remove("selected");
    });
    clickedLi.classList.add("selected");

    const year = link.textContent;
    mainLink.firstChild.textContent = year;

    updateUI(year);
  });

  document.addEventListener("click", (e) => {
    if (
      !isLarge() &&
      subnavigation.style.display === "block" &&
      !subnavigation.contains(e.target) &&
      !navigation.contains(e.target)
    ) {
      hide();
    }

    const popup = document.querySelector(".popup_is-opened");
    if (popup) {
      closePopup(popup);
    }
  });

  window.addEventListener("resize", () => {
    if (isLarge()) {
      subnavigation.style.display = "";
    } else {
      hide();
    }
  });

  const selectedLi = document.querySelector(".subnavigation .selected");
  if (selectedLi) {
    const year = selectedLi.querySelector("a").textContent;
    updateUI(year);
  }
});
