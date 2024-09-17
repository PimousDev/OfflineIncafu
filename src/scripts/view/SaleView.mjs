import SaleModel from "../model/SaleModel.mjs";
import View from "./View.mjs";
import ProductTableView from "./ProductTableView.mjs";
import ViewEvent from "../ViewEvent.mjs";

class SaleView extends View{

	/** @type {HTMLTemplateElement} */
	static #HTML_SALE_TEMPLATE = document.getElementById("saleView");
	/**
	 * @typedef {object} ProductTableEvents
	 * @property {string} validate
	 */
	/** @type {ProductTableEvents} */
	static #events = Object.freeze({
		change: "change",
		validate: "validate"
	});

	/**
	 * @typedef {object} SaleElements
	 * @property {ProductTableView} [productTable]
	 * @property {HTMLSpanElement} [totalSpan]
	 * @property {HTMLSpanElement} [countSpan]
	 * @property {HTMLSelectElement} [settlementSelect]
	 * @property {HTMLInputElement} [validateInput]
	 */
	/** @type {SaleElements} */
	#elements = {
		productTable: undefined,
		totalSpan: undefined,
		countSpan: undefined,
		settlementSelect: undefined,
		validateInput: undefined
	};

	constructor(){
		super();
		const shadowRoot = this.attachShadow({ mode: "closed" });

		shadowRoot.appendChild(
			SaleView.HTML_SALE_TEMPLATE.content.cloneNode(true)
		);

		this.#elements.productTable = shadowRoot.querySelector(
			"oi-producttable"
		);
		this.#elements.totalSpan = shadowRoot.getElementById("total");
		this.#elements.countSpan = shadowRoot.getElementById("count");
		this.#elements.settlementSelect = shadowRoot.getElementById(
			"settlement"
		);
		this.#elements.validateInput = shadowRoot.getElementById("validate");

		// Listeners
		this.#elements.validateInput.addEventListener("click",
			this.#validateInputClicked.bind(this)
		);
	}

	// GETTERS
	static get HTML_SALE_TEMPLATE(){
		return SaleView.#HTML_SALE_TEMPLATE;
	}
	static get events(){ return SaleView.#events; }

	get productTable(){ return this.#elements.productTable; }

	// FUNCTIONS
	/**
	 * @param {SaleModel} sale
	 */
	renderSale(sale){
		this.#elements.totalSpan.textContent = sale.getTotal().toFixed(2);
		this.#elements.countSpan.textContent = sale.getCount();
	}

	// LISTENERS
	/**
	 * @param {SubmitEvent} event
	 */
	#validateInputClicked(event){
		if(!this.#elements.productTable.checkValidity()
			|| !this.#elements.settlementSelect.checkValidity()
		) return;

		this.dispatchEvent(new ViewEvent(SaleView.events.validate, {
			composed: true,
			data: {
				settlement: this.#elements.settlementSelect.value
			}
		}))
	}
}
customElements.define("oi-sale", SaleView);

export default SaleView;