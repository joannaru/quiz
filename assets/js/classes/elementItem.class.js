import elementShared from "./elementShared.class"
import HTTPclient  from "./HTTPclient.class";

    
export default class elementItem extends elementShared {
    
    li; // represents Item of Collection
    spanName; // name of Item
    divEdit; // div with form
    divBtns; // div with buttons to edit Item

    /**
     * Creates element li for items of ul list - with buttons
     * @param {Item} item object
     * @param {Collection} collection object
     */
     createListItem(item, collection) {
        this.li = document.createElement('li')
        this.li.classList.add('item')
        this.li.dataset.id = item.id;
        // Item name
        this.spanName = document.createElement('span')
        this.spanName.innerText = item.name
        this.spanName.classList.add('data__title')

        this.divData = document.createElement('div')
        this.divData.classList.add('item__data', 'data')
        this.divEdit = elementItem.createForm('item__edit', 'SAVE', true, item)
 
        this.divBtns = this.createItemButtons(item)// requires this.li, this.divEdit
        // main appends
        this.li.appendChild(this.divData);
        this.li.append(this.divEdit)
        this.divData.appendChild(this.spanName)
        this.divData.appendChild(this.divBtns)
        //events
        const patch = true
        this.addSaveItemEvent(item, collection.id, this.divEdit, patch)
 
        return this.li
    }

    /**
     * Creates buttons: Edit, Remove with Events
     * @param {Item} item
     */
     createItemButtons(item) {
        const divBtns = document.createElement('div')
        divBtns.classList.add('data__buttons')
        const { btnEdit, btnRemove } = elementItem.createEditRemoveButtons()

        divBtns.appendChild(btnEdit)
        divBtns.appendChild(btnRemove)
        // events 
        btnEdit.addEventListener('click', () => {
            this.divEdit.classList.toggle('item__edit--hidden')
        })
        btnRemove.addEventListener('click', () => {
            const decision = confirm(`This will remove item: ${item.name}. Are you sure?`, '')
            if (decision === true) {
                HTTPclient.deleteItem(item.id)
                this.li.remove();
            }
        })

        return divBtns
    }

    /**
     * Creates Event which saves Item data 
     * @param {Item} item item of collection represented by item.class.jc
     * @param {Number} collectionId id
     * @param {HTMLelement} divForm form inside this.li
     * @param {Boolean} patch defuault PATCH else POST item
     */
     addSaveItemEvent(item, collectionId, divForm, patch = true) {
        const btnSave = divForm.querySelector('.form__save')
        btnSave.addEventListener('click', event => {
            event.preventDefault();
            this.saveItemEvent(item, collectionId, divForm, patch)
        });
    }

    /**
     * Saves Item data by POST (Add) or PATCH (Edit)
     * @param {Item} item item of collection represented by item.class.jc
     * @param {Number} collectionId id
     * @param {HTMLelement} divForm form to save - Modal or form inside this.li
     * @param {Boolean} patch defuault PATCH else POST item
     */
    saveItemEvent(item, collectionId, divForm, patch = true) {

        const newName = divForm.querySelector('.input__name').value
        const newDefinition = divForm.querySelector('.input__definition').value
        // new item to save
        let itemChanged = { name: newName, definition: newDefinition }
        if (patch === true) {
            const itemId = item.id
            const result = HTTPclient.patchItem(itemId, itemChanged)
            //close editor, 
            const editElemExists = divForm.classList.contains('item__edit');
            if (editElemExists) {
                divForm.classList.add('item__edit--hidden')
                divForm.parentElement.querySelector('.data__title').innerText = newName
            }
        } else {
            HTTPclient.postItem(collectionId, itemChanged).then(response => {
                const li = this.createListItem(response.data, itemChanged)
                const divData = li.querySelector('.item__data');
                const ul = document.querySelector(`ul[data-id="${collectionId}"]`)
                ul.appendChild(li)
            })
        }
    }
}