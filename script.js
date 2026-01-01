import { getRecords } from "./api.js";

const getBookmarks = async () => {
	const { records } = await getRecords("tblWQu4A3rdu6tFO6");
	return records;
};

const localBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

if (!localBookmarks.length) {
	localStorage.setItem("bookmarks", JSON.stringify(await getBookmarks()));
}

const renderBookmarks = async () => {
	const grid = document.querySelector(".grid");
	grid.innerHTML = "";
	localBookmarks
		.sort((a, b) => a.fields.Name.localeCompare(b.fields.Name))
		.forEach(({ fields: { Background = "transparent", Icon, Name, Scale, URL } }) => {
			grid.innerHTML += `
			<a href="${URL}">
				${
					Icon.startsWith("https")
						? `<img src="${Icon}" style="background: ${Background}">`
						: `<div class="icon" style="background: ${Background}">${Icon}</div>`
				}
				${Name}
			</a>
		`;
		});
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
