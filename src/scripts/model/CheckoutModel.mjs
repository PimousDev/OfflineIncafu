import SaleModel from "./SaleModel.mjs";
import ValidableModel from "./ValidableModel.mjs";

class CheckoutModel extends ValidableModel{

	/** @type {Date} */
	#startDate;
	/** @type {Date} */
	#endDate;
	/** @type {string} */
	#information;
	/** @type {SaleModel[]} */
	#sales;

	/**
	 * @param {Date} startDate
	 * @param {string} information
	 * @param {SaleModel[]} sales
	 */
	constructor(startDate, information, sales){
		super();

		this.startDate = startDate ?? new Date();
		this.information = information ?? "";
		this.sales = sales ?? [];
	}

	// GETTERS
	get startDate(){ return this.#startDate; }
	get endDate(){ return this.#endDate; }
	get information(){ return this.#information; }
	get sales(){ return this.#sales; }
	getTotal(){
		return this.sales.reduce((acc, s) => acc + s.getTotal(), 0);
	}
	getCount(){
		return this.sales.reduce((acc, s) => acc + s.getCount(), 0);
	}

	/**
	 * @param {number} index
	 * @returns {SaleModel}
	 */
	getSale(index){ return this.products[index]; }

	isValid(){
		return this.date !== undefined && this.sales.every(s => s.isValid());
	}

	// SETTERS
	set startDate(startDate){ this.#startDate = startDate; }
	set information(information){ this.#information = information; }
}

export default CheckoutModel;