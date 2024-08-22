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
	 * @property {HTMLInputElement|undefined} newInput
	 */
	/** @type {ProductTableElements} */
	#elements = {
		newInput: undefined
	};

	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: "closed"});

		shadowRoot.appendChild(
			ProductTableView.HTML_TABLE_TEMPLATE.content.cloneNode(true)
		);

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