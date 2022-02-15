
export default class Item {
    _id;
    _name = '';
    _definition = '';
    _skip = false;
    sides = Object.freeze({ name: 'name', definition: 'definition' })

    currentSide = this.sides.name;

    constructor(id, name, definition) {
        this._id = id;
        this._name = name;
        this._definition = definition;
    }

    get id() {
        return this._id
    }

    set id(id) {
        this._id = id
    }

    get name() {
        return this._name
    }

    set name(name) {
        this._name = name
    }

    get definition() {
        return this._definition
    }

    set definition(definition) {
        this._definition = definition
    }

    get skip() {
        return this._skip
    }

    set skip(skip) {
        this._skip = skip
    }

    /**
     * Returns sides of card
     * @returns NodeList
     */
    getElements() {
        return document.querySelectorAll('.card__side');
    }

    /**
     * Rotates side of card
     */
    rotate() {
        this.getElements().forEach((elem) => {
            elem.classList.toggle('rotate')
            // Safari problem: overflow:scroll doesn't work along with perspective/backface
            elem.querySelector('.text-wrapper').classList.toggle('text-wrapper--scroll')
        })
        this.currentSide = this.currentSide == this.sides.name ? this.sides.definition : this.sides.name
    }

    skipItem() {
        this._skip = true;
    }

}