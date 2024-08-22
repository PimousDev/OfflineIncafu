import ProductModel from "../model/ProductModel.mjs";
import View from "./View.mjs";
import ViewEvent from "../ViewEvent.mjs";

class ProductTableView extends View{

	/** @type {HTMLTemplateElement} */
	static #HTML_TABLE_TEMPLATE = document.getElementById("productTableView");
	/** @type {HTMLTemplateElement} */
	static #HTML_PRODUCT_TEMPLATE = document.getElementById("productView");
	/**
	 * @typedef {object} ProductTableEvents
	 * @property {string} new
	 */
	/** @type {ProductTableEvents} */
	static #events = Object.freeze({
		new: "new"
	});

	/**
	 * @typedef {object} ProductTableElements
	 * @property {HTMLTableSectionElement} [tableBody]
	 * @property {HTMLInputElement} [newInput]
	 * @property {Map<ProductModel, HTMLTableRowElement>} productRows
	 */
	/** @type {ProductTableElements} */
	#elements = {
		tableBody: undefined,
		newInput: undefined,
		productRows: new Map()
	};

	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: "closed"});

		shadowRoot.appendChild(
			ProductTableView.HTML_TABLE_TEMPLATE.content.cloneNode(true)
		);

		this.#elements.tableBody = shadowRoot.getElementById("products");
		this.#elements.newInput = shadowRoot.getElementById("new");

		// Listeners
		this.#elements.newInput.addEventListener("keyup",
			this.#newInputKeyPressed.bind(this)
		);
	}

	// GETTERS
	static get HTML_TABLE_TEMPLATE(){
		return ProductTableView.#HTML_TABLE_TEMPLATE;
	}
	static get HTML_PRODUCT_TEMPLATE(){
		return ProductTableView.#HTML_PRODUCT_TEMPLATE;
	}
	static get events(){ return ProductTableView.#events; }

	// FUNCTIONS
	/**
	 * @param {ProductModel[]} products
	 */
	renderProducts(products){
		const rows = new Map(this.#elements.productRows);

		for(const [i, p] of products.entries()){
			let row = rows.get(p);
			rows.delete(p);

			if(row === undefined){
				/** @type {HTMLTableRowElement} */
				row = ProductTableView.#HTML_PRODUCT_TEMPLATE
					.content.querySelector("tr").cloneNode(true);

				this.#elements.productRows.set(p, row);
				this.#elements.tableBody.insertRow(i).replaceWith(row);
			}else if(
				Array.from(this.#elements.tableBody.children).indexOf(row) !== i
			)
				this.#elements.tableBody.insertBefore(row,
					this.#elements.tableBody.children.item(i)
				);

			row.querySelector("[name=\"barcode\"]").value = p.barcode;
			row.querySelector("[name=\"code\"]").value = p.code;
			row.querySelector("[name=\"designation\"]").value = p.designation;
			row.querySelector("[name=\"unitPrice\"]").value = p.unitPrice;
			row.querySelector("[name=\"quantity\"]").value = p.quantity;
			row.querySelector(".pt--rowPrice").textContent = p.getPrice()
				.toFixed(2);
		}

		for(const row of rows.values()) row.remove();
	}

	// LISTENERS
	/**
	 * @param {KeyboardEvent} event
	 */
	#newInputKeyPressed(event){
		if(event.key !== "Enter" || !this.#elements.newInput.checkValidity())
			return;

		this.dispatchEvent(new ViewEvent(ProductTableView.events.new, {
			data: this.#elements.newInput.value
		}));

		this.#elements.newInput.value = "";
	}
}
customElements.define("oi-producttable", ProductTableView);

export default ProductTableView;