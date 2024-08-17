import ValidableModel from "./ValidableModel.mjs";
import ProductModel from "./ProductModel.mjs";

class SaleModel extends ValidableModel{

	static SETTLEMENT_CASH = 0;
	static SETTLEMENT_CREDIT_CARD = 1;
	static SETTLEMENT_CHECK = 2;

	/** @type {ProductModel[]} */
	#products;
	/** @type {number} */
	#settlement;

	/**
	 * @param {ProductModel[]} products 
	 * @param {number} settlement 
	 */
	constructor(products, settlement){
		this.products = products ?? [];
		this.settlement = settlement ?? SaleModel.SETTLEMENT_CASH;
	}

	// GETTERS
	get products(){ return this.#products; }
	getTotal(){
		return this.products.reduce((acc, p) => acc + p.getPrice(), 0);
	}
	getCount(){
		return this.products.reduce((acc, p) => acc + p.quantity, 0);
	}
	get settlement(){ return Math.floor(this.#settlement); }

	/**
	 * @param {number} index
	 * @returns {ProductModel}
	 */
	getProduct(index){ return this.products[index]; }
	/**
	 * @param {number} barCode 
	 * @returns {ProductModel|undefined}
	 */
	getProductByBarCode(barCode){
		return this.products.find(p => p.barCode === barCode);
	}
	/**
	 * @param {number} code 
	 * @returns {ProductModel|undefined}
	 */
	getProductByCode(code){
		return this.products.find(p => p.code === code);
	}
	/**
	 * @param {string} designation
	 * @returns {ProductModel|undefined}
	 */
	getProductByDesignation(designation){
		return this.products.find(p => p.designation === designation);
	}

	isValid(){
		return this.products > 0
			&& this.products.every(p => p.isValid())
			&& this.settlement > -1
	}

	// SETTERS
	set settlement(settlement){ this.#settlement = settlement; }
	/**
	 * @param {ProductModel} product 
	 */
	mergeProduct(product){
		const foundElements = [
			this.getProductByBarCode(product.barCode),
			this.getProductByCode(product.code),
			this.getProductByDesignation(product.designation)
		];

		if(foundElements.every(p => p === undefined))
			this.products.push(product);
		else
			foundElements.find(p => p !== undefined).mergeWith(product)

	}
}

export default SaleModel;