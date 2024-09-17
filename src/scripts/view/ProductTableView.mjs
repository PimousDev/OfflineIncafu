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
	 * @property {string} change
	 */
	/** @type {ProductTableEvents} */
	static #events = Object.freeze({
		new: "new",
		change: "change"
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

	/**
	 * @param {ParentNode} node
	 * @returns {HTMLInputElement[]}
	 */
	getInputs(node){
		return Array.from(node.querySelectorAll("input"));
	}

	/**
	 * @returns {boolean}
	 */
	checkValidity(){
		return Array.from(this.#elements.productRows.values()).every(
			row => this.getInputs(row).every(input => input.checkValidity()),
			this
		);
	}

	// FUNCTIONS
	/**
	 * @param {ProductModel[]} products
	 */
	renderProducts(products){
		const rows = new Map(this.#elements.productRows);

		for(const [i, p] of products.entries()){
			let row = this.#elements.productRows.get(p);
			rows.delete(p);

			if(row === undefined){
				/** @type {HTMLTableRowElement} */
				row = ProductTableView.#HTML_PRODUCT_TEMPLATE
					.content.querySelector("tr").cloneNode(true);

				row.addEventListener("input",
					this.#inputValueChanged.bind(this, p)
				);

				this.#elements.productRows.set(p, row);
				this.#elements.tableBody.insertRow(i).replaceWith(row);
			}else if(
				Array.from(this.#elements.tableBody.children).indexOf(row) !== i
			)
				this.#elements.tableBody.insertBefore(row,
					this.#elements.tableBody.children.item(i)
				);

			this.renderProduct(p, i);
		}

		for(const row of rows.values()) row.remove();
	}
	/**
	 * @param {ProductModel} product
	 */
	renderProduct(product){
		const row = this.#elements.productRows.get(product);

		row.querySelector("[name=\"barcode\"]").value = product.barcode;
		row.querySelector("[name=\"code\"]").value = product.code;
		row.querySelector("[name=\"designation\"]").value = product.designation;
		row.querySelector("[name=\"unitPrice\"]").value = product.unitPrice;
		row.querySelector("[name=\"quantity\"]").value = product.quantity;
		row.querySelector(".pt--rowPrice").textContent = product.getPrice()
			.toFixed(2);
	}

	// LISTENERS
	/**
	 * @param {KeyboardEvent} event
	 */
	#newInputKeyPressed(event){
		if(event.key !== "Enter"
			|| this.#elements.newInput.disabled
			|| this.getInputs(this.#elements.tableBody).some(element =>
				!element.checkValidity()
			)
		) return;

		this.dispatchEvent(new ViewEvent(ProductTableView.events.new, {
			composed: true,
			data: this.#elements.newInput.value
		}));

		this.#elements.newInput.value = "";
	}
	/**
	 * @param {ProductModel} product
	 * @param {InputEvent} event
	 */
	#inputValueChanged(product, event){
		if(!(event.currentTarget instanceof HTMLTableRowElement)) return;
		const inputElements = this.getInputs(event.currentTarget);

		if(inputElements.some(element => !element.checkValidity())){
			this.#elements.newInput.disabled = true;
			return;
		}else this.#elements.newInput.disabled = false;

		this.dispatchEvent(new ViewEvent(ProductTableView.events.change, {
			composed: true,
			data: {
				product: product,
				inputs: inputElements.map(e => ({
					name: e.name,
					value: e.value
				}))
			}
		}));
	}
}
customElements.define("oi-producttable", ProductTableView);

export default ProductTableView;