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

		if(!update){
			view.addEventListener(ProductTableView.events.new,
				this.#newProductEntered.bind(this)
			);
			view.addEventListener(ProductTableView.events.change,
				this.#productChanged.bind(this)
			);
		}
	}

	// LISTENERS
	/**
	 * @param {ViewEvent<ProductTableView, string>} event 
	 */
	#newProductEntered(event){
		const sale = this.#controlled.get(event.currentTarget);
		const product = new ProductModel(null, null, null);

		if(event.data.match(ProductModel.CODE_PATTERN))
			product.code = event.data;
		else if(event.data.match(ProductModel.BARCODE_PATTERN))
			product.barcode = event.data;
		else
			product.designation = event.data;

		sale.mergeProduct(product);
		event.currentTarget.renderProducts(sale.products);
	}
	/**
	 * @param {ViewEvent<ProductTableView, {
	 * 	product: ProductModel
	 * 	inputs: {name: string, value: string}[]
	 * }>} event 
	 */
	#productChanged(event){
		for(const input of event.data.inputs){
			switch(input.name){
				case "barcode":
				case "code":
					if(input.value.length === 0 || isNaN(input.value))
						input.value = null;
					break;
			}

			event.data.product[input.name] = input.value;
		}
		event.currentTarget.renderProduct(event.data.product,
			this.#controlled.get(event.currentTarget)
				.products.indexOf(event.data.product)
		);
	}
}

export default ProductTableController;