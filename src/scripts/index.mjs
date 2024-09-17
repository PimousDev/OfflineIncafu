import SaleModel from "./model/SaleModel.mjs";
import SaleView from "./view/SaleView.mjs";
import SaleController from "./controller/SaleController.mjs";

const model = new SaleModel([], null);
const view = new SaleView();

const controller = new SaleController();
controller.setControlled(view, model);

document.getElementById("main").appendChild(view);