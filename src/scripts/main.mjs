import SaleComponent from "/js/sale.mjs";

// CLOSING PREVENTION
window.addEventListener("beforeunload", e => {
	e.preventDefault();
});

// SALES
/** @type {HTMLDivElement} */
const salesGroup = document.getElementById("sales");
/** @type {HTMLSpanElement} */
const sales = document.getElementById("sales");
const saleCount = 0;

document.getElementById("addSale").addEventListener("click", e => {
	if(salesGroup.children.length === 0
		|| Array.from(salesGroup.children)
			.filter(element => element instanceof SaleComponent)
			.every(sale => sale.isValidated())
	){
		salesGroup.insertBefore(document.createElement("oi-sale"), e.target);

		saleCount++;
		
	}
});

// SAVING
document.getElementById("save").addEventListener("submit", e =>{
	e.preventDefault();
});