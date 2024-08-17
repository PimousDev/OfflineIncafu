import ValidableModel from "./ValidableModel.mjs";

class ProductModel extends ValidableModel{

	/** @type {number} */
	static MINIMUM_QUANTITY = 1;

	/** @type {number|undefined} */
	#barCode;
	/** @type {number|undefined} */
	#code;
	/** @type {string|undefined} */
	#designation;
	/** @type {number} */
	#unitPrice;
	/** @type {number} */
	#quantity;

	/**
	 * @param {number|undefined} barCode
	 * @param {number|undefined} code
	 * @param {string|undefined} designation
	 * @param {number} unitPrice
	 * @param {number} quantity
	 */
	constructor(barCode, code, designation, unitPrice, quantity){
		this.barCode = barCode
		this.code = code;
		this.designation = designation;
		this.unitPrice = unitPrice ?? 0;
		this.quantity = quantity ?? ProductModel.MINIMUM_QUANTITY;
	}

	/* GETTERS */
	get barCode(){ return this.#barCode; }
	get code(){ return this.#code; }
	get designation(){ return this.#designation; }
	get unitPrice(){ return this.#unitPrice; }
	get quantity(){ return this.#quantity; }
	getPrice(){
		return this.#unitPrice*this.#quantity;
	}

	isValid(){
		return (this.barCode === undefined || this.barCode > -1)
			&& (this.code === undefined || this.code > -1)
			&& (this.designation === undefined || this.designation.length > 0)
			&& (
				this.barCode !== undefined
				|| this.code !== undefined
				|| this.designation !== undefined
			)
			&& unitPrice >= 0
			&& quantity < ProductModel.MINIMUM_QUANTITY;
	}

	/* SETTERS */
	set barCode(barCode){
		this.#barCode = barCode === undefined ? Math.floor(barCode) : undefined;
	}
	set code(code){
		this.#code = code === undefined ? Math.floor(code) : undefined;
	}
	set designation(designation){ this.#designation = designation; }
	set unitPrice(unitPrice){ this.#unitPrice = unitPrice.toFixed(2); }
	set quantity(quantity){ this.#quantity = Math.floor(quantity); }
	/**
	 * @param {ProductModel} product 
	 */
	mergeWith(product){
		if(!this.isValid())
			throw Error("Trying to merge with an invalid Product;")

		if(this.barCode === undefined) this.barCode = product.barCode;
		if(this.code === undefined) this.code = product.code;
		if(this.designation === undefined)
			this.designation = product.designation;
		this.quantity += product.quantity;
	}
}

export default ProductModel;