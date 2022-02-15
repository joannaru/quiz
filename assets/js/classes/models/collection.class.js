export default class Collection {
    _id;
    // Collection name
    _name = '';
    // all cards in Collection
    _items = [];
    // current card object
    _currItem = null;
    // currend card index
    _currIdx = null;


    constructor(id, name, items) {

        Object.defineProperties(this, {
            _name: { enumerable: false },
            _items: { enumerable: false },
            _currItem: { enumerable: false },
            _currIdx: { enumerable: false }
        });
        this._id = id;
        this._name = name;
        this._items = items;
        this.initCurrValues()
    }



    initCurrValues() {
        if (this.items.length != 0) {
            this._currItem = this.items[0]
            this._currIdx = 0;
        }
    }

    get id() {
        return this._id
    }

    set id(id) {
        this._id = id
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items;
    }

    get currIdx() {
        return this._currIdx;
    }

    set currIdx(currIdx) {
        this._currIdx = currIdx
    }

    get currItem() {
        return this._currItem;
    }

    set currItem(currItem) {
        this._currItem = currItem
    }

    getItem(index) {
        return this._items[index]
    }

    nextItem(itemDiv) {
        if (++this._currIdx < this._items.length) {
            if (this._items[this._currIdx].skip === true) {
                this.nextItem(itemDiv)
                return;
            }
            // rotate to Item name side
            if (this._currItem.currentSide == this._currItem.sides.definition) {
                this._currItem.rotate()
            }
            // next item
            this._currItem = this._items[this._currIdx]
        } else {
            //end
            this.initCurrActiveValues()
        }

    }

    initCurrActiveValues(){
        const firstActiveId = this._items.findIndex(item => item.skip ===false)
        if (this.items.length != 0) {
            this._currItem = this.items[firstActiveId]
            this._currIdx = firstActiveId;
        }
    }
}