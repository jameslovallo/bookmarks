import { getRecords } from "./api.js";

const list = document.querySelector(".list");

const fetchBookmarks = async () => {
  const { records } = await getRecords("tbldjjuIzlPhttH8u");
  list.innerHTML = "";

  const bookmarks = {};

  await Promise.all(
    records.map(async ({ fields: { Icon, Name, URL } }) => {
      const iconMarkup = await fetch(
        `https://raw.githubusercontent.com/LawnchairLauncher/lawnicons/refs/heads/develop/svgs/${Icon || "lawnicons"}.svg`,
      )
        .then((res) => res.text())
        .then((res) => res.replace("<svg", '<svg viewBox="0 0 192 192"'));

      const linkMarkup = `<a href="${URL}"><div class="icon">${iconMarkup}</div>${Name}</a>`;

      const firstLetter = Name.charAt(0).toLowerCase();
      if (!bookmarks[firstLetter]) bookmarks[firstLetter] = {};
      bookmarks[firstLetter][Name] = linkMarkup;
    }),
  );

  let bookmarkHTML = "";

  Object.keys(bookmarks)
    .sort()
    .forEach((letter) => {
      bookmarkHTML += `<h2 id="${letter}">${letter.toUpperCase()}</h2>`;
      const sortedLinks = Object.keys(bookmarks[letter])
        .sort()
        .map((name) => bookmarks[letter][name])
        .join("");
      bookmarkHTML += `<div class="link-grid">${sortedLinks}</div>`;
    });
  localStorage.setItem("bookmarks", bookmarkHTML);
  list.innerHTML = bookmarkHTML;
};

const localBookmarks = localStorage.getItem("bookmarks");

if (localBookmarks?.length) {
  list.innerHTML = localBookmarks;
} else fetchBookmarks();

document.querySelector("nav button").addEventListener("click", async () => {
  fetchBookmarks();
});

function updateClock() {
  const clockElement = document.querySelector(".clock");
  const dateElement = document.querySelector(".date");
  const d = new Date();

  clockElement.textContent = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/AM|PM/, "");

  dateElement.textContent = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

updateClock();
setInterval(updateClock, 5000);

async function updateWeather() {
  const weatherElement = document.querySelector(".weather");
  const conditions = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current=temperature_2m&temperature_unit=fahrenheit",
  ).then((res) => res.json());
  const {
    current: { temperature_2m },
  } = conditions;
  const degrees = Math.round(Number(temperature_2m));
  weatherElement.textContent = degrees + "°";
}

updateWeather();
setInterval(updateClock, 1200000);

addEventListener("keydown", ({ key }) => {
  const heading = document.getElementById(key);
  heading.scrollIntoView({ behavior: "smooth" });
  const link = document.querySelector(`#${key} + div > a`);
  link.focus();
});
