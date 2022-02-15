export default class elementShared {
    /**
     * Creates buttons template: Edit, Remove
     * for Quiz/Item
     */
    static createEditRemoveButtons(editClassNames = ['fas', 'fa-pencil-alt'], removeClassNames=['far', 'fa-trash-alt']) {

        const iconEdit = document.createElement('i')
        iconEdit.classList.add(...editClassNames)
        const btnEdit = document.createElement('button')
        btnEdit.classList.add('data__button', 'button__edit')
        btnEdit.title = 'Edit'
        btnEdit.appendChild(iconEdit)

        const iconRemove = document.createElement('i')
        iconRemove.classList.add(...removeClassNames)
        const btnRemove = document.createElement('button')
        btnRemove.classList.add('data__button', 'button__remove')
        btnRemove.title = 'Remove'
        btnRemove.appendChild(iconRemove)

        const buttons = { btnEdit, btnRemove }

        return buttons
    }


    /**
     * Creates form with Name and optional Definition fields
     * for Quiz/Item
     * @param {String} className class name for form.parentElement
     * @param {String} buttonName text of button which saves created form
     * @param {Boolean} addDefElement default add definition input - if false only name input
     * @param {Quiz/Item/null} item existing quiz/item or new empty one
     */
    static createForm(className, buttonName = 'SAVE', addDefElement = true, item=null) {

        const div = document.createElement('div')
        div.classList.add(className, 'item__editor', className + '--hidden')

        const form = document.createElement('form')
        form.classList.add('editor__form')
        const labelName = document.createElement('label')
        labelName.innerText = 'Name'
        const inputName = document.createElement('input')
        inputName.classList.add('form__input', 'input__name')
        const labelDef = document.createElement('label')
        labelDef.innerText = 'Definition'
        const inputDef = document.createElement('textarea')
        inputDef.classList.add('form__input', 'input__definition')
        if (item) {
            inputName.value = item.name
            inputDef.value = item.definition
        }
        const btnSave = document.createElement('button')
        btnSave.classList.add('form__save', 'button--reduce')
        btnSave.innerText = buttonName
        // main appends
        form.appendChild(labelName)
        form.appendChild(inputName)
        if(addDefElement===true){
            form.appendChild(labelDef)
            form.appendChild(inputDef)
        }
        form.appendChild(btnSave)
        div.appendChild(form);

        return div
    }
}