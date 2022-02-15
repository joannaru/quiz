import HTTPclient from "./HTTPclient.class";
import elementQuiz from "./elementQuiz.class"
import elementItem from "./elementItem.class"

const container = document.querySelector('.flex-article');
export default class List {

    quizes = []; // elementQuiz.class elements

    static getContainer() {
        return container;
    }
    /**
     * Initialization of quizes data
     */
    async init() {
        // for static button "New Quiz"
        const eq = new elementQuiz();
        eq.addBtnNewQuizEvent();
        // for modal
        this.addCloseModalEvent();
        // expand all quizes
        this.addShowAllItemsEvent()

        //get collections data from API
        const collections = await HTTPclient.getAll();
        document.querySelector('.loader').classList.add('loader--hidden')

        for (let c of collections) {
            const eQuiz = new elementQuiz()
            const name = c.name;
            const id = c.id;
            // ul list
            const { div, list } = eQuiz.createQuiz(c);
            // li items
            (c.items).forEach(item => {
                const eItem = new elementItem();
                const li = eItem.createListItem(item, c)
                list.appendChild(li)
            })
            // single quiz
            List.getContainer().appendChild(div)
            this.quizes.push(eQuiz);
        }
    }

    addCloseModalEvent() {
        const btnClose = document.getElementById('modal__btn-close')
        const modal = document.getElementById('modal')
        const modalBody = document.getElementById("modal__body")
        btnClose.addEventListener('click', event => {
            modal.classList.remove('modal--show')
            modalBody.innerHTML = '';
        })
    }

    addShowAllItemsEvent() {
        const btnToggle = document.querySelector('.btn-toggle-quizes')
        const btnToggleIcon = btnToggle.querySelector('i');
        const classClosed = 'fa-chevron-down'
        const classOpen = 'fa-chevron-up'

        btnToggle.addEventListener('click', event => {
            const isClosed = btnToggleIcon.classList.contains(classClosed);
            if (isClosed === true) {
                for (const q of this.quizes) {
                    q.showItemsList();
                }
            } else {
                for (const q of this.quizes) {
                    q.hideItemsList();
                }
            }
            btnToggleIcon.classList.toggle(classClosed)
            btnToggleIcon.classList.toggle(classOpen)
        })
    }

}