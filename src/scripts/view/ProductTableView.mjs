class ProductTableView extends HTMLElement{

	/** @type {HTMLTemplateElement} */
	static HTML_TABLE_TEMPLATE = document.getElementById("productTableView");
	/** @type {HTMLTemplateElement} */
	static HTML_PRODUCT_TEMPLATE = document.getElementById("productView");
	/**
	 * @typedef ProductTableEvents
	 * @type {object}
	 * @property {string} new
	 */
	/** @type {ProductTableEvents} */
	static #events = {
		new: "new"
	};

	/**
	 * @typedef ProductTableElements
	 * @type {object}
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

	// LISTENERS
	/**
	 * @param {KeyboardEvent} event
	 * @param {HTMLInputElement} event.target
	 */
	#newInputKeyPressed(event){
		if(event.key !== "Enter" || !this.#elements.newInput.checkValidity())
			return;

		this.dispatchEvent(new InputEvent(ProductTableView.#events.new, {
			data: this.#elements.newInput.value,
			inputType: "insertText"
		}));

		this.#elements.newInput.value = "";
	}
}
customElements.define("oi-producttable", ProductTableView);

export default ProductTableView;