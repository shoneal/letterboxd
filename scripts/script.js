const films = {
  2025: {
    "Black Bag": ["2025-03-14", 6],
    Warfare: ["2025-04-10", 5],
    "Thunderbolts*": ["2025-05-01", 6],
    Materialists: ["2025-06-19", 6],
    Weapons: ["2025-08-08", 4],
    "Caught Stealing": ["2025-08-29", 8],
    "One Battle After Another": ["2025-09-26", 7],
    Nonnas: ["2025-05-09", 6],
    "Wake Up Dead Man": ["2025-12-12", 7],
    "The Roses": ["2025-08-18", 5],
  },
  2024: {
    "Orion and the Dark": ["2024-02-02"],
    "Dune: Part Two": ["2024-02-28", 11],
    "Arthur the King": ["2024-04-04", 4],
    "Furiosa: A Mad Max Saga": ["2024-05-23", 6],
    Challengers: ["2024-04-24", 4],
    "Deadpool & Wolverine": ["2024-07-25", 17],
    "Alien: Romulus": ["2024-08-15", 5],
    "The Wild Robot": ["2024-09-27", 6],
    Flow: ["2024-08-29", 10],
    "Paddington in Peru": ["2024-11-28", 5],
    Nosferatu: ["2024-12-25", 11],
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
const setupImageWithContainer = (img, container = null) => {
  const onLoadOrError = () => {
    img.style.opacity = "1";
    if (container) container.style.opacity = "1";
    img.removeEventListener("load", onLoadOrError);
    img.removeEventListener("error", onLoadOrError);
  };

  if (img.complete) {
    onLoadOrError();
  } else {
    img.addEventListener("load", onLoadOrError);
    img.addEventListener("error", onLoadOrError);
  }
}; // Функция для настройки прозрачности изображения
function updateUI(year) {
  const data = films[year];
  if (!data) return;

  const validTitles = Object.keys(data).filter(
    (title) => data[title].length >= 2
  );
  const randomTitle =
    validTitles[Math.floor(Math.random() * validTitles.length)];
  const randomNum = Math.floor(Math.random() * data[randomTitle][1]) + 1;

  const getBackdropUrl = (sizeType) =>
    `${basicLink}backdrop/${year}/${toSlug(
      randomTitle
    )}/${sizeType}/${randomNum}.jpg`;

  const backdropContainer = document.querySelector(".backdrop-container");
  const backdropPicture = backdropContainer.querySelector(".backdropimage");
  const backdropImg = backdropPicture.querySelector("img");

  const mobileSource = backdropPicture.querySelector(
    'source[media="(max-width: 767px)"]'
  );
  const desktopSource = backdropPicture.querySelector(
    'source[media="(min-width: 768px)"]'
  );

  mobileSource.srcset = getBackdropUrl("mobile");
  desktopSource.srcset = getBackdropUrl("desktop");
  backdropImg.src = getBackdropUrl("desktop");
  backdropImg.alt = `"${randomTitle}" Shot`;

  backdropContainer.style.opacity = "0";
  setupImageWithContainer(backdropImg, backdropContainer);

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
    img.src = `${basicLink}posters/${year}/thumb/${toSlug(title)}.jpg`;
    setupImageWithContainer(img);

    li.appendChild(img);
    posterList.appendChild(li);

    li.addEventListener("click", (e) => {
      const posterImage = popup.querySelector(".poster-image");

      posterImage.style.opacity = "0";
      posterImage.src = `${basicLink}posters/${year}/full/${toSlug(title)}.jpg`;
      posterImage.alt = alt;
      setupImageWithContainer(posterImage);

      openPopup(popup);
      e.stopPropagation();
    }); // Клик по постеру и открытии попапа
  });
} // Обновление списка постеров и главной картинки

const openPopup = (popup) => {
  const body = document.body;
  body.dataset.scrollPosition = window.scrollY;
  body.style.top = `-${body.dataset.scrollPosition}px`;
  body.classList.add("scroll-lock");
  popup.classList.add("show");
  requestAnimationFrame(() => {
    popup.querySelector(".modal-popup").classList.add("show");
  });

  document.addEventListener("keydown", closePopupByEsc);
}; // Открытие popup
const closePopup = (popup) => {
  const body = document.body;
  const scrollPosition = body.dataset.scrollPosition;
  popup.querySelector(".modal-popup").classList.remove("show");
  setTimeout(() => {
    body.style.top = "";
    body.classList.remove("scroll-lock");
    window.scrollTo(0, scrollPosition);

    popup.classList.remove("show");
    popup.querySelector("img").src = "";

    document.removeEventListener("keydown", closePopupByEsc);
  }, 250);
}; // Закрытие popup
const closePopupByEsc = (e) =>
  e.key === "Escape" && closePopup(popup.querySelector(".show")); // Закрытие popup по Esc

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

    if (popup.classList.contains("show")) {
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
