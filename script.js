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
	localBookmarks
		.sort((a, b) => a.fields.Name.localeCompare(b.fields.Name))
		.forEach(({ fields: { Icon, Name, URL } }) => {
			let iconText, iconColor;
			if (!Icon.startsWith("https")) {
				iconText = Icon.split("|")[0];
				iconColor = Icon.split("|")[1];
			}
			grid.innerHTML += `
			<a href="${URL}">
				${!iconText ? `<img src="${Icon}">` : ""}
				${
					iconText
						? `<div class="icon" style="background: ${iconColor}">${iconText}</div>`
						: ""
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
	renderBookmarks();
});
