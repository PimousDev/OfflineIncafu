import SaleModel from "../model/SaleModel.mjs";
import ProductTableView from "../view/ProductTableView.mjs";
import ViewEvent from "../ViewEvent.mjs";

class ProductTableController{

	/** @type {Map<ProductTableView, SaleModel>} */
	#controlled = new Map();

	// SETTERS
	/**
	 * @param {ProductTableView} view 
	 * @param {SaleModel} model 
	 */
	setControlled(view, model){
		const update = this.#controlled.has(view);
		this.#controlled.set(view, model);

		if(!update)
			view.addEventListener(ProductTableView.events.new,
				this.#newProductEntered.bind(this)
			);
	}

	// LISTENERS
	/**
	 * @param {ViewEvent<string>} event 
	 */
	#newProductEntered(event){
		console.log(event);
	}
}

export default ProductTableController;