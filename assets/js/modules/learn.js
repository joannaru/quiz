import Collection from '../classes/models/collection.class'
// static data
import HTTPclient from '../classes/HTTPclient.class';

const session = window.sessionStorage;

const LEARN_NS = {
    itemDiv: document.getElementById('card'),
    nextBtn: document.getElementById('button__next'),
    skipBtn: document.getElementById('button__skip'),
    resetBtn: document.getElementById('button__reset'),
    nextQuizBtn: document.getElementById('button__next-quiz'),
    collections: null,
    collection: null,
};

function setCurrItemData(collection) {
    LEARN_NS.itemDiv.querySelector('.card__name .text-wrapper').textContent = LEARN_NS.collection.currItem.name;
    LEARN_NS.itemDiv.querySelector('.card__definition .text-wrapper').textContent = LEARN_NS.collection.currItem.definition;
}

async function getCurrCollectionName() {
    let sessQuizId = session.getItem('collection_id')
    if (!sessQuizId) {
        const defaultId = 1;
        session.setItem('collection_id', defaultId)
        sessQuizId = defaultId
    }
    if (!LEARN_NS.collections) {
        LEARN_NS.collections = await HTTPclient.getAll();
        document.querySelector('.card-container').classList.remove('card-container--hidden')
        document.querySelector('.loader').classList.add('loader--hidden')
    }
    LEARN_NS.collection = LEARN_NS.collections.find(currColl => currColl.id == sessQuizId)

}

async function init() {
    await getCurrCollectionName();
    setHeading(LEARN_NS.collection.name)
    setCurrItemData(LEARN_NS.collection)
}

function addEvents() {
    LEARN_NS.itemDiv.addEventListener('click', function () {
        LEARN_NS.collection.currItem.rotate(LEARN_NS.itemDiv);
    })

    LEARN_NS.nextBtn.addEventListener('click', function () {
        LEARN_NS.collection.nextItem(LEARN_NS.itemDiv);
        setCurrItemData(LEARN_NS.collection)
    })

    LEARN_NS.skipBtn.addEventListener('click', function () {
        LEARN_NS.collection.currItem.skipItem();
        const activeItems = LEARN_NS.collection.items.filter(item => item.skip === false).length
        if (activeItems > 0) {
            LEARN_NS.collection.nextItem(LEARN_NS.itemDiv);
            setCurrItemData(LEARN_NS.collection)
        }
        if (activeItems === 1) {
            disableItemButtons()
        }
    })

    LEARN_NS.resetBtn.addEventListener('click', () => {
        LEARN_NS.collection.items.forEach(item => item.skip = false)
        LEARN_NS.collection.initCurrValues()
        setCurrItemData(LEARN_NS.collection)
        enableItemButtons()
    })

    LEARN_NS.nextQuizBtn.addEventListener('click', function () {
        let index = LEARN_NS.collections.findIndex(c => c.id = LEARN_NS.collection.id)
        if (++index < LEARN_NS.collections.length) {
            LEARN_NS.collection = LEARN_NS.collections[index]
            setHeading(LEARN_NS.collection.name)
            setCurrItemData(LEARN_NS.collection)
            if (++index >= LEARN_NS.collections.length) {
                enableQuizButtons()
            }
        }
    })
}

function setHeading(quizName) {
    document.querySelector('.quiz-name').innerText = quizName;
}

function disableItemButtons() {
    LEARN_NS.nextBtn.disabled = true;
    LEARN_NS.skipBtn.disabled = true;
}
function enableItemButtons() {

    LEARN_NS.nextBtn.disabled = false
    LEARN_NS.skipBtn.disabled = false
}
function enableQuizButtons() {

    LEARN_NS.nextBtn.disabled = false
    LEARN_NS.skipBtn.disabled = false
    LEARN_NS.nextQuizBtn.disabled = true;
}

function start() {
    init();
    addEvents();
}

window.addEventListener('DOMContentLoaded', (event) => {
    start();
});


