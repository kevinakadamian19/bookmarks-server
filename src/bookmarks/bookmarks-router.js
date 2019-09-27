const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const bookmarksRouter = express.Router();
const bodyParser = express.json()

const bookmarks = [{
    id: 5,
    title: "Etsy",
    url: "https://www.etsy.com",
    description: "Find the perfect handmade gift, vintage & on-trend clothes, unique jewelry, and more… lots more.",
    rating: 4
}];

bookmarksRouter
    .route('/bookmark')
    .get(bodyParser, (req,res) =>  {
        res.json(bookmarks);
    })
    .post(bodyParser, (req,res) => {
        const { title, url, description, rating} = req.body;
        if(!title) {
            logger.error(`Title is requred`);
            return res.status(400).send('Invalid data');
        }
        if(!url) {
            logger.error(`URL is requred`);
            return res.status(400).send('Invalid data');
        }
        function isUrl(str) {
            regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if (regexp.test(str)){
            return true;
            } else {
            return false;
            };
        }
        if(isUrl(`${url}`) === false) {
            logger.error(`URL must be valid web address.`);
            return res.status(400).status('Invalid data')
        }
        if(!rating) {
            logger.error(`Rating is requred`);
            return res.status(400).send('Invalid data');
        }
        if(rating < 0 || rating > 5) {
            logger.error(`Rating must be between 1 and 5`);
            return res.status(400).send('Invalid data');
        }
        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarks.push(bookmark);
        logger.info(`Bookmark with id ${id} added`);
        res
            .status(201)
            .location(`http:localhost:8000/bookmarks/${id}`)
            .json({id});
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get(bodyParser, (req,res) => {
        const {id} = req.params;
        const bookmark = bookmarks.find(b => b.id == id);
        //find specific bookmark
        if(!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`)
            return res.status(404).send('Bookmark not found');
        }
        res.json(bookmark);
    })
    .delete(bodyParser, (req,res) => {
        const {id} = req.params;
        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

        if(bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res.status(404).send('Not found.')
        }
        bookmarks.splice(bookmarkIndex, 1);
        logger.info(`Bookmark with id ${id} deleted`);
        res.status(204).end();
    })

module.exports = bookmarksRouter;