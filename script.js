import { getRecords } from "./api.js";

const getBookmarks = async () => {
  const { records } = await getRecords("tbldjjuIzlPhttH8u");
  return records;
};

const localBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

if (!localBookmarks.length) {
  localStorage.setItem("bookmarks", JSON.stringify(await getBookmarks()));
}

const renderBookmarks = async () => {
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";
  
  const links = await Promise.all(
    localBookmarks.map(async ({ fields: { Icon, Name, URL } }) => {
      const iconMarkup = await fetch(
        `https://raw.githubusercontent.com/LawnchairLauncher/lawnicons/refs/heads/develop/svgs/${Icon || 'lawnicons'}.svg`,
      )
        .then((res) => res.text())
        .then((res) => res.replace("<svg", '<svg viewBox="0 0 192 192"'));
      return `<a href="${URL}"><div class="icon">${iconMarkup}</div>${Name}</a>`;
    })
  );

  grid.innerHTML = links.join('');
};

renderBookmarks();

document
  .querySelector('input[type="search"]')
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const search = e.target.value;
      window.location.href = `https://www.google.com/search?q=${search}`;
    }
  });

document.querySelector("nav button").addEventListener("click", async () => {
  localStorage.setItem("bookmarks", JSON.stringify(await getBookmarks()));
  location.reload();
});
