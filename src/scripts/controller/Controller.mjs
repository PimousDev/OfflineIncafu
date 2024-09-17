import ValidableModel from "../model/ValidableModel.mjs";
import View from "../view/View.mjs";

/**
 * @template {View} V
 * @template {ValidableModel} M
 *
 * @abstract
 */
class Controller{

	/** @type {Map<V, M>} */
	#controlled = new Map();

	// GETTERS
	/**
	 * @param {V} view
	 * @returns {M}
	 */
	getControlled(view){ return this.#controlled.get(view); }
	/**
	 * @returns {Map<string, CallableFunction>}
	 * @abstract
	 */
	getListeners(){ }

	// SETTERS
	/**
	 * @param {V} view 
	 * @param {M} model 
	 */
	setControlled(view, model){
		const updated = this.#controlled.has(view);
		this.#controlled.set(view, model);

		if(!updated)
			for(const [type, func] of this.getListeners())
				view.addEventListener(type, func);
	}
	/**
	 * @param {V} view 
	 */
	removeControlled(view){
		if(this.#controlled.delete(view))
			for(const [type, func] of this.getListeners())
				view.removeEventListener(type, func);
	}
}

export default Controller;