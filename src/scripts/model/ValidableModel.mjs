/**
 * @abstract
 */
class ValidableModel{

	/** @type {boolean} */
	#validated = false;

	// GETTERS
	get validated(){ return this.#validated; }
	/**
	 * @returns {boolean}
	 * @abstract
	 */
	isValid(){ }

	// SETTERS
	/**
	 * @throws {Error}
	 */
	validate(){
		if(this.validated){
			console.warn("Tried to validate a validated sale.");
			return;
		}

		if(this.isValid()) this.#validated = true;
		else throw new Error("Cannot validate invalid model.");
	}
}

export default ValidableModel;