import HTTPclient  from "./HTTPclient.class";
import elementItem from "./elementItem.class"
import elementShared from "./elementShared.class"

const container = document.querySelector('.flex-article');

export default class elementQuiz extends elementShared {

    div; // main div representing Quiz element
    divTitle; // div with header and buttons
    headingName; // header with Quiz name

    divButtons; // buttons to edit Quiz
    btnLearn; // go to Learning this Quiz
    btnAddItem; // add newf Item to Quiz
    btnEdit; // edit Quiz
    btnRemove; // remove Quiz

    ulList; // list of Items of Quiz

    static getContainer(){
        return container;
    }

    /**
     * Creates element div for Quiz - with buttons and  empty ul list of items
     * @param {Number} collectionId
     * @param {Number} collectionName 
     */
     createQuiz(collection) {
        this.div = document.createElement('div')
        this.div.classList.add('collapsible')
        // div with quiz name and buttons
        this.divTitle = document.createElement('div')
        this.divTitle.classList.add('collapsible__title')
        this.divTitle.dataset.id = collection.id
        this.headingName = document.createElement('H2')
        this.headingName.innerText = collection.name
        this.headingName.classList.add('name')
        // ul list
        this.ulList = document.createElement('ul')
        this.ulList.classList.add('collapsible__list')
        this.ulList.dataset.id = collection.id
        // quiz buttons
        this.divButtons = this.createQuizButtons(collection);
        // main appends
        this.divTitle.appendChild(this.headingName)
        this.divTitle.appendChild(this.divButtons)
        this.div.appendChild(this.divTitle)
        this.div.appendChild(this.ulList)
        // events
        this.divTitle.addEventListener('click', event => {
            this.toggleItemsList()
        });
        const div = this.div;
        const list = this.ulList;

        return { div, list }
    }

    isItemsListVisible(){
        return this.divTitle.classList.contains('collapsible__title--active')
    }

    toggleItemsList(){
        this.ulList.classList.toggle('collapsible__list--active')
        this.divTitle.classList.toggle('collapsible__title--active')
    }
    showItemsList(){
        this.ulList.classList.add('collapsible__list--active')
        this.divTitle.classList.add('collapsible__title--active')
    }
    hideItemsList(){
        this.ulList.classList.remove('collapsible__list--active')
        this.divTitle.classList.remove('collapsible__title--active')
    }

    /**
     * Creates buttons: Learn, Add, Edit, Remove with Events
     * @param {Number} collectionId
     * @param {Number} collectionName
     */
     createQuizButtons(collection) {
        const { btnEdit, btnRemove } = elementQuiz.createEditRemoveButtons(['fa','fa-edit'])
        this.btnEdit = btnEdit;
        this.btnRemove = btnRemove;
        // div for buttons
        const divButtons = document.createElement('div')
        divButtons.classList.add('data__buttons')
        // button learn
        const iconLearn = document.createElement('i')
        iconLearn.classList.add('fas', 'fa-graduation-cap')
        this.btnLearn = document.createElement('button')
        this.btnLearn.classList.add('data__button', 'button__learn')
        this.btnLearn.title = "Learn"
        this.btnLearn.appendChild(iconLearn)
        // button add new item
        const iconAdd = document.createElement('i')
        iconAdd.classList.add('fas', 'fa-plus')
        this.btnAddItem = document.createElement('button')
        this.btnAddItem.classList.add('data__button', 'button__add')
        this.btnAddItem.title = "Add new item"
        this.btnAddItem.appendChild(iconAdd)
        // main appends
        divButtons.appendChild(this.btnLearn)
        divButtons.appendChild(this.btnAddItem)
        divButtons.appendChild(this.btnEdit)
        divButtons.appendChild(this.btnRemove)
        // events
        this.addBtnLearnEvent(collection.id)
        // open save form -  inside modal
        this.createModalForm('item__add', this.btnAddItem, collection.id)
        this.createModalForm('edit-quiz', this.btnEdit, collection.id, {name:collection.name, definition:null})
        this.btnRemove.addEventListener('click',event=>{
            const decision = confirm(`This will remove quiz ${collection.name}. Are you sure?`, '')
            if (decision === true) {
                HTTPclient.deleteQuiz(collection.id)
                this.div.remove();
            }
        })

        return divButtons
    }

    /**
     * Adds event for button Learn
     * @param {Number} collectionId id
     */
     addBtnLearnEvent(collectionId) {
        this.btnLearn.addEventListener('click', event => {
            event.stopImmediatePropagation()
            window.sessionStorage.setItem('collection_id', collectionId)
            window.location.href = './quizlet.html';
        })
    }
    /**
     * Saves quiz
     * @param {String} name new Quiz name
     */
    saveNewQuiz(name){
       HTTPclient.postQuiz({'name':name}).then(response=>{
            const { div, list } = this.createQuiz({id: response.data.id, name: name});
            elementQuiz.getContainer().appendChild(div)
       })
       
    }

    /**
     * Adds event for button New Quiz
     */
    addBtnNewQuizEvent() {
        const btnNewQuiz = document.getElementById('btn-new-quiz')
        this.createModalForm('add-quiz', btnNewQuiz)
    }

    /**
     * Adds newly created form to Modal: edit Quiz, add Quiz, add new Item to Quiz
     * @param {String} className class name for new Modal form
     * @param {HTMLelement} buttonShow button which shows Modal form
     * @param {Number} collectionId id
     * @param {Collection} quiz existing Collection to Edit form
     */
    createModalForm(className, buttonShow, collectionId=null, quiz=null){
        const modal = document.getElementById("modal")
        const modalBody = modal.querySelector(".modal__body")
        const btnClose = document.getElementById('modal__btn-close')

        buttonShow.addEventListener('click', event => {
            event.stopImmediatePropagation();
            modal.classList.add("modal--show")

            const addDefElement = ['add-quiz', 'edit-quiz'].includes(className) ? false : true;
            const btnName = className === 'edit-quiz' ? 'SAVE': 'ADD';
            const divForm = elementQuiz.createForm(className, btnName, addDefElement, quiz)
            const inputName= divForm.querySelector('.input__name')
            const btnSave = divForm.querySelector('.form__save')
            // add form to modal and focus on input
            modalBody.appendChild(divForm);
            const formAddItem = modalBody.querySelector('.item__add')
            inputName.focus()
            modal.scrollIntoView();
            // SAVE event for Button
            btnSave.addEventListener('click',event=>{
                event.stopImmediatePropagation()
                event.preventDefault();

                if(formAddItem){
                    // new Item - button inside Quiz element
                    const patch = false;
                    const eItem = new elementItem();
                    eItem.saveItemEvent(null, collectionId, formAddItem, patch)
                    this.isItemsListVisible() === false ? this.toggleItemsList() : null;
                } else if(className === 'add-quiz'){
                    //post Quiz
                    this.saveNewQuiz(inputName.value);
                }else if(className === 'edit-quiz'){
                    // patch Quiz
                    HTTPclient.patchQuiz(collectionId,{name:inputName.value})
                    const nameElem = document.querySelector(`.collapsible__title[data-id="${collectionId}"] .name`)
                    nameElem.innerText =  inputName.value
                }
                // close and reset modal body
                btnClose.click();
            });
        })
    }
}