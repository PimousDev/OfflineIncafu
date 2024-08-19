import SaleModel from "./model/SaleModel.mjs";
import ProductTableController from "./controller/ProductTableController.mjs";
import ProductTableView from "./view/ProductTableView.mjs";

const model = new SaleModel([], null);
const controller = new ProductTableController();
const view = new ProductTableView();

controller.setControlled(view, model);
document.getElementById("main").appendChild(view);