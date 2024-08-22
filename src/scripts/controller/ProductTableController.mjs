import ProductModel from "../model/ProductModel.mjs";
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
	 * @param {ViewEvent<ProductTableView, string>} event 
	 */
	#newProductEntered(event){
		const product = new ProductModel(null, null, null);

		if(event.data.match(ProductModel.CODE_PATTERN))
			product.code = event.data;
		else if(event.data.match(ProductModel.BARCODE_PATTERN))
			product.barcode = event.data;
		else
			product.designation = event.data;

		this.#controlled.get(event.currentTarget).mergeProduct(product);
	}
}

export default ProductTableController;