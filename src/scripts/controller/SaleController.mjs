import SaleModel from "../model/SaleModel.mjs";
import ProductTableView from "../view/ProductTableView.mjs";
import SaleView from "../view/SaleView.mjs";
import Controller from "./Controller.mjs";
import ProductTableController from "./ProductTableController.mjs";
import ViewEvent from "../ViewEvent.mjs";

/**
 * @extends {Controller<SaleView, SaleModel>}
 */
class SaleController extends Controller{

	/** @type {ProductTableController} */
	#productTableController = new ProductTableController();
	/** @type {Map<string, CallableFunction>} */
	#listeners = new Map([
		[SaleView.events.validate, this.saleValidated.bind(this)],
		[ProductTableView.events.new, this.productTableUpdated.bind(this)],
		[ProductTableView.events.change, this.productTableUpdated.bind(this)]
	]);

	// GETTERS
	/**
	 * @returns {Map<string, CallableFunction>}
	 */
	getListeners(){ return this.#listeners; }
	
	// SETTERS
	/**
	 * @param {SaleView} view 
	 * @param {Sale} model 
	 */
	setControlled(view, model){
		super.setControlled(view, model);
		this.#productTableController.setControlled(view.productTable, model);
	}
	/**
	 * @param {SaleView} view 
	 */
	removeControlled(view){
		super.removeControlled(view);
		this.#productTableController.removeControlled(view.productTable);
	}

	// LISTENERS
	/**
	 * @param {ViewEvent<SaleView, string>} event
	 */
	productTableUpdated(event){
		event.currentTarget.renderSale(
			this.getControlled(event.currentTarget)
		);
	}
	/**
	 * @param {ViewEvent<SaleView, {
	 * 	settlement: string
	 * }>} event 
	 */
	saleValidated(event){
		const sale = this.getControlled(event.currentTarget);

		switch(event.data.settlement){
			case "cash":
				sale.settlement = SaleModel.SETTLEMENT_CASH;
				break;
			case "creditCard":
				sale.settlement = SaleModel.SETTLEMENT_CREDIT_CARD;
				break;
			case "cheque":
				sale.settlement = SaleModel.SETTLEMENT_CHECK;
				break;
		}

		try{
			sale.validate();
		}catch(e){
			alert(e);
			return;
		}

		this.removeControlled(event.currentTarget);
		event.currentTarget.renderSale(sale);
	}
}

export default SaleController;