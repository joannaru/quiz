import Collection from '../classes/models/collection.class';
import { HTTPClient } from '../classes/HTTPclient.class';
import List from '../classes/list.class';

window.addEventListener('DOMContentLoaded', (event) => {
    const container = document.querySelector('.flex-article');
    const list = new List(container);

    list.init();
})
