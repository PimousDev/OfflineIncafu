import ValidableModel from "./ValidableModel.mjs";

class ProductModel extends ValidableModel{

	/** @type {string} */
	static #CODE_PATTERN = "^[0-9]{3}$";
	/** @type {string} */
	static #BARCODE_PATTERN = "^[0-9]+$";
	/** @type {number} */
	static #MINIMUM_QUANTITY = 1;

	/** @type {?number} */
	#barcode;
	/** @type {?number} */
	#code;
	/** @type {?string} */
	#designation;
	/** @type {number} */
	#unitPrice;
	/** @type {number} */
	#quantity;

	/**
	 * @param {?number} barcode
	 * @param {?number} code
	 * @param {?string} designation
	 * @param {number} [unitPrice]
	 * @param {number} [quantity]
	 */
	constructor(barcode, code, designation,
		unitPrice = 0, quantity = ProductModel.MINIMUM_QUANTITY
	){
		super();

		this.barcode = barcode
		this.code = code;
		this.designation = designation;
		this.unitPrice = unitPrice;
		this.quantity = quantity;
	}

	/* GETTERS */
	static get BARCODE_PATTERN(){ return this.#BARCODE_PATTERN; }
	static get CODE_PATTERN(){ return this.#CODE_PATTERN; }
	static get MINIMUM_QUANTITY(){ return this.#MINIMUM_QUANTITY; }

	get barcode(){ return this.#barcode; }
	get code(){ return this.#code; }
	get designation(){ return this.#designation; }
	get unitPrice(){ return this.#unitPrice; }
	get quantity(){ return this.#quantity; }
	getPrice(){
		return this.#unitPrice*this.#quantity;
	}

	isValid(){
		return (this.barcode === null || this.barcode > -1)
			&& (this.code === null || this.code > -1)
			&& (this.designation === null || this.designation.length > 0)
			&& (
				this.barcode !== null
				|| this.code !== null
				|| this.designation !== null
			)
			&& unitPrice >= 0
			&& quantity >= ProductModel.MINIMUM_QUANTITY;
	}

	/* SETTERS */
	set barcode(barcode){
		this.#barcode = barcode !== null ? Math.floor(barcode) : null;
	}
	set code(code){
		this.#code = code !== null ? Math.floor(code) : null;
	}
	set designation(designation){ this.#designation = designation; }
	set unitPrice(unitPrice){ this.#unitPrice = unitPrice; }
	set quantity(quantity){ this.#quantity = Math.floor(quantity); }
	/**
	 * @param {ProductModel} product 
	 */
	mergeWith(product){
		if(!this.isValid())
			throw Error("Trying to merge with an invalid Product;")

		if(this.barcode === null) this.barcode = product.barcode;
		if(this.code === null) this.code = product.code;
		if(this.designation === null) this.designation = product.designation;
		this.quantity += product.quantity;
	}
}

export default ProductModel;