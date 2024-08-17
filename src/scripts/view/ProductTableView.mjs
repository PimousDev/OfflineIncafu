class ProductTableView extends HTMLElement{

	/** @type {HTMLTemplateElement} */
	static HTML_TABLE_TEMPLATE = document.getElementById("productTableView");
	/** @type {HTMLTemplateElement} */
	static HTML_PRODUCT_TEMPLATE = document.getElementById("productView");
	/** @type {string} */
	static INPUT_EVENT_IDENTIFIER = "input";

	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: "closed"});

		shadowRoot.appendChild(
			ProductTableView.HTML_TABLE_TEMPLATE.content.cloneNode(true)
		);
	}
}
customElements.define("oi-producttable", ProductTableView);

export default ProductTableView;