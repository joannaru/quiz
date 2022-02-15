import axios from 'axios';
import Item from './models/item.class'
import Collection from './models/collection.class'

export default class HTTPclient {

    static urlProd = 'https://my-json-server.typicode.com/joannaru/quiz-db';
    static urlDev = 'http://localhost:4000';
    static urlMain = this.urlProd;
    static urlCollections = this.urlMain + '/collections/';
    static urlItems = this.urlMain + '/items/';
    static async getCollections() {

        var objCollections = [];
        // names of available Collections
        const promiseCollections = axios.get(this.urlCollections).then(response => response.data)

        return promiseCollections;
    }

    static async getItems(collectionId) {

        const promiseItems = axios.get(this.urlCollections + `${collectionId}/items`)
            .then(function (response) {
                // handle success
                const colItems = response.data
                const items = [];

                colItems.forEach(colItems_item => {
                    items.push(new Item(colItems_item.id, colItems_item.name, colItems_item.definition));
                })

                return items;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        return promiseItems;
    }

    static async getAll() {
        const collections = await this.getCollections();
        const allCollections = []
        for (let c of collections) {
            let items = await this.getItems(c.id)

            let collection = new Collection(c.id, c.name, items)
            allCollections.push(collection)
        }
        return allCollections;
    }
    // Items
    static postItem(collectionId, itemObj) {
        const promise = axios.post(this.urlCollections + collectionId + "/items", itemObj)
            .then(function (response) {
                //console.log(response);
                return response
            })
            .catch(function (error) {
                console.log(error);
            });
        return promise;
    }

    static async patchItem(id, itemObj) {
        axios.patch(this.urlItems + `${id}`, itemObj)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    static async deleteItem(id) {
        axios.delete(this.urlItems + `${id}`)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    // Collections
    static postQuiz(quizObj) {
        const promise = axios.post(this.urlCollections, quizObj)
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                console.log(error);
            });
        return promise;
    }

    static async patchQuiz(id, quizObj) {
        axios.patch(this.urlCollections + `${id}`, quizObj)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    static async deleteQuiz(id) {
        axios.delete(this.urlCollections + `${id}`)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
