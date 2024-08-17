import ProductTableView from "./view/ProductTableView.mjs";

const test = new ProductTableView();

test.addEventListener("input", e => {
	console.log("Hey!")
});

document.getElementById("main").appendChild(test);