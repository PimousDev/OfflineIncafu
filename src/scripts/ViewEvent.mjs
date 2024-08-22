import View from "./view/View.mjs";

/**
 * @template {View} V
 * @template T
 */
class ViewEvent extends Event{

	/** @type {?T} */
	#data;

	/**
	 * @typedef {object} VEInit
	 * @property {?T} data
	 *
	 * @typedef {EventInit & VEInit} ViewEventInit
	 */
	/**
	 * @param {string} type
	 * @param {?ViewEventInit} eventInitDict
	 */
	constructor(type, eventInitDict){
		super(type, eventInitDict);

		this.#data = eventInitDict.data;
	}

	// GETTERS
	/** @type {V} */
	get currentTarget(){ return super.currentTarget; }
	get data(){ return this.#data; }
}

export default ViewEvent;