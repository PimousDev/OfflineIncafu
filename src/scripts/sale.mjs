class SaleComponent extends HTMLElement{

	/** @type {HTMLTemplateElement} */
	static SALE_TEMPLATE = document.getElementById("newSale");
	/** @type {HTMLTemplateElement} */
	static PRODUCT_TEMPLATE = document.getElementById("newProduct");

	/** @type {HTMLTableSectionElement} */
	#productsElement;
	/** @type {HTMLInputElement} */
	#newProductElement;
	/** @type {HTMLButtonElement} */
	#validateElement;
	/** @type {HTMLSpanElement} */
	#totalElement;
	/** @type {HTMLSpanElement} */
	#countElement;

	/** @type {boolean} */
	#validated = false;

	constructor(){
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(document.importNode(
			SaleComponent.SALE_TEMPLATE.content, true
		));

		// Define elements
		this.#productsElement = this.shadowRoot.getElementById("products");
		this.#newProductElement = this.shadowRoot.getElementById("newProduct");
		this.#validateElement = this.shadowRoot.getElementById("validate");
		this.#totalElement = this.shadowRoot.getElementById("total");
		this.#countElement = this.shadowRoot.getElementById("count");

		// Add event listeners
		this.#newProductElement.addEventListener("keyup",
			this.onNewLine.bind(this)
		);
		this.#validateElement.addEventListener("click",
			this.onValidation.bind(this)
		);
	}

	// GETTERS
	isValidated(){ return this.#validated; }

	/** @returns {Array<HTMLSelectElement | HTMLInputElement>} */
	get elements(){
		return Array.from(this.shadowRoot.querySelectorAll(
			"select, input:not([name=\"submit\"])"
		));
	}
	/**
	 * @param {HTMLTableRowElement} row 
	 * @param {string} name
	 * @returns {HTMLInputElement}
	 */
	getRowInput(row, name){
		return row.querySelector(`input[name="${name}"]`);
	}

	isCompleted(){
		return this.#productsElement.childElementCount > 1
			&& Array.from(this.elements)
				.filter(e => e.id !== "newProduct")
				.every(e => !e.required || e.value.length > 0);
	}

	// SETTERS
	/**
	 * @param {HTMLTableRowElement} row 
	 * @param {string} name
	 * @param {string} value
	 */
	setRowInput(row, name, value){
		row.querySelector(`input[name="${name}"]`).value = value;
	}

	// EVENTS
	/** @param {KeyboardEvent} event */
	onNewLine(event){
		if(event.key !== "Enter" || !event.target.checkValidity()) return;
		/** @type {DocumentFragment} */
		const docFrag = document.importNode(
			SaleComponent.PRODUCT_TEMPLATE.content, true
		);
		const row = docFrag.children[0];

		if(event.target.value.match("^[0-9]{3}$"))
			this.setRowInput(row, "code", event.target.value);
		else if(event.target.value.match("^[0-9]+$"))
			this.setRowInput(row, "barcode", event.target.value);
		else
			this.setRowInput(row, "designation", event.target.value);

		// Add event listeners
		this.getRowInput(row, "priceUnit").addEventListener("input", e => {
			this.onPriceShouldChange.call(this, row);
			this.onTotalShouldChange.call(this);
		});

		this.getRowInput(row, "quantity").addEventListener("input", e => {
			this.onPriceShouldChange.call(this, row);
			this.onTotalShouldChange.call(this);
			this.onCountShouldChange.call(this);
		});

		// Insert elements
		this.#productsElement.insertBefore(docFrag,
			this.#productsElement.lastElementChild
		);
		this.getRowInput(row, "priceUnit").focus({ focusVisible: true });
		this.onCountShouldChange.call(this);

		event.target.value = "";
	}

	/** @param {HTMLTableRowElement} row */
	onPriceShouldChange(row){
		const price = parseFloat(
			this.getRowInput(row, "priceUnit").value
		) * parseInt(
			this.getRowInput(row, "quantity").value
		);
		
		row.querySelector(".sale--price").textContent = !isNaN(price) ?
			price.toFixed(2) : "?";
	}
	onTotalShouldChange(){
		this.#totalElement.textContent = Array.from(
			this.#productsElement.querySelectorAll(".sale--price")
		).reduce((acc, e) => {
			const num = parseFloat(e.textContent);

			if(!isNaN(num)) acc += num;
			return acc;
		}, 0).toFixed(2);
	}
	onCountShouldChange(){
		this.#countElement.textContent = this.elements
			.filter(e => e.name === "quantity")
			.reduce((acc, e) => {
				const num = parseInt(e.value);
	
				if(!isNaN(num)) acc += num;
				return acc;
			}, 0);
	}

	onValidation(){
		if(!this.isCompleted()) return;
		this.#validated = true;

		this.#validateElement.remove();
		this.shadowRoot.querySelector("tbody > tr:last-of-type").remove();

		this.elements.forEach(e => {
			let textElement = e.parentElement.querySelector("label")
			if(!textElement) textElement = e.parentElement;

			if(e.name === "priceUnit")
				textElement.textContent = parseFloat(
					e.value
				).toFixed(2) + "€";
			else if(e.name === "settlement"){
				const span = document.createElement("span");
				span.classList.add("sale--infoData");
				span.textContent = e.value;
				textElement.appendChild(span);
			}else textElement.textContent += e.value.length > 0 ? e.value : "-";

			e.remove();
		});
	}
}
customElements.define("oi-sale", SaleComponent);

export default SaleComponent;