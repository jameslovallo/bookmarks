const api = "https://api.airtable.com/v0";

const base = "app3tVAbA9u7w4Uiy";

const token =
	"patGX0yPuNcMRRtJm.d909c2e4feb09812f45ceec50c0bea450481b4a179d5a124589baa246838b8d0";

export const getRecords = (table, id = "") =>
	fetch(`${api}/${base}/${table + (id ? "/" + id : "")}`, {
		headers: { Authorization: `Bearer ${token}` },
	}).then((res) => res.json());

export const updateRecord = (table, id, fields) =>
	fetch(`${api}/${base}/${table}/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ fields }),
	}).then((res) => res.json());

export const deleteRecord = (table, id) =>
	fetch(`${api}/${base}/${table}/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	}).then((res) => res.json());

export const createRecord = (table, fields) =>
	fetch(`${api}/${base}/${table}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ fields }),
	}).then((res) => res.json());

const getBookmarks = async () => {
	const grid = document.querySelector(".grid");
	const { records } = await getRecords("tblWQu4A3rdu6tFO6");
	records
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

getBookmarks();
