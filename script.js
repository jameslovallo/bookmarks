import { getRecords } from "./api.js";

const grid = document.querySelector(".grid");

const localBookmarks = localStorage.getItem("bookmarks");

if (localBookmarks.length) {
  grid.innerHTML = localBookmarks;
} else fetchBookmarks();

const fetchBookmarks = async () => {
  console.log("updating bookmarks");
  const { records } = await getRecords("tbldjjuIzlPhttH8u");
  grid.innerHTML = "";

  const gridLinks = await Promise.all(
    records.map(async ({ fields: { Icon, Name, URL } }) => {
      const iconMarkup = await fetch(
        `https://raw.githubusercontent.com/LawnchairLauncher/lawnicons/refs/heads/develop/svgs/${Icon || "lawnicons"}.svg`,
      )
        .then((res) => res.text())
        .then((res) => res.replace("<svg", '<svg viewBox="0 0 192 192"'));
      return `<a href="${URL}"><div class="icon">${iconMarkup}</div>${Name}</a>`;
    }),
  );

  const gridMarkup = gridLinks.join("");
  localStorage.setItem("bookmarks", gridMarkup);
  grid.innerHTML = gridMarkup;
};

document
  .querySelector('input[type="search"]')
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const search = e.target.value;
      window.location.href = `https://www.google.com/search?q=${search}`;
    }
  });

document.querySelector("nav button").addEventListener("click", async () => {
  fetchBookmarks();
});
