import { getRecords } from "./api.js";

const list = document.querySelector(".list");

const fetchBookmarks = async () => {
  const { records } = await getRecords("tbldjjuIzlPhttH8u");
  list.innerHTML = "";

  const listObject = {};

  await Promise.all(
    records.map(async ({ fields: { Icon, Name, URL } }) => {
      const iconMarkup = await fetch(
        `https://raw.githubusercontent.com/LawnchairLauncher/lawnicons/refs/heads/develop/svgs/${Icon || "lawnicons"}.svg`,
      )
        .then((res) => res.text())
        .then((res) => res.replace("<svg", '<svg viewBox="0 0 192 192"'));

      const linkMarkup = `<a href="${URL}"><div class="icon">${iconMarkup}</div>${Name}</a>`;

      const firstLetter = Name.charAt(0);
      if (!listObject[firstLetter]) listObject[firstLetter] = [];
      listObject[firstLetter].push(linkMarkup);
    }),
  );

  let listMarkup = "";

  Object.keys(listObject).forEach((letter) => {
    listMarkup += `<h2>${letter}</h2>`;
    listMarkup += `<div class="link-grid">${listObject[letter].join("")}</div>`;
  });
  localStorage.setItem("bookmarks", listMarkup);
  console.log(listMarkup);
  list.innerHTML = listMarkup;
};

const localBookmarks = localStorage.getItem("bookmarks");

if (localBookmarks.length) {
  list.innerHTML = localBookmarks;
} else fetchBookmarks();

document.querySelector("nav button").addEventListener("click", async () => {
  fetchBookmarks();
});

const clockElement = document.querySelector('.clock');

function updateClock() {
  clockElement.textContent = new Date().toLocaleTimeString(navigator.language, {hour: 'numeric', minute:'2-digit'});
}

// Initial call to avoid layout delay, then update every second
updateClock();
setInterval(updateClock, 1000);