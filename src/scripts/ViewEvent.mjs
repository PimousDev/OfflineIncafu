import View from "./view/View.mjs";

/**
 * @template T
 */
class ViewEvent extends Event{

	/** @type {View} */
	#view;
	/** @type {?T} */
	#data;

	/**
	 * @typedef {object} VEInit
	 * @property {View} view
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

		this.#view = eventInitDict.view;
		this.#data = eventInitDict.data;
	}

	// GETTERS
	get view(){ return this.#view; }
	get data(){ return this.#data; }
}

export default ViewEvent;