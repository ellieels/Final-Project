import express from 'express';
import * as ctrl from '../controllers/mainController.js';
import * as auth from '../controllers/authController.js';
import * as post from '../controllers/postController.js';
import GlazePost from '../models/glazePost.js';
import Post from '../models/Post.js';

import path from 'path';
import multer from 'multer';

const router = express.Router();
//const path = require('path');
//const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: 'public/images', // Destination to store image 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 100000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
}) 

// Define routes
router.get('/login', auth.login);
router.post('/login', auth.verifyLogin);
router.get('/register', auth.register);
router.post('/register', auth.verifyRegister);
router.get('/logout', auth.logout);


router.get('/', ctrl.home);
router.get('/glazes', ctrl.glazes);

router.get('/gallery',ctrl.gallery);
router.post('/searchPosts', ctrl.searchPosts);

router.get('/account', auth.isAuthenticated, ctrl.account);

router.get('/favorites', auth.isAuthenticated, ctrl.favorites);
router.get('/uploadart', auth.isAuthenticated, ctrl.uploadart);
router.get('/uploadglaze', auth.isAuthenticated, ctrl.uploadglaze);


router.post('/postart', auth.isAuthenticated, imageUpload.array('images', 10), post.createPost);


router.post('/postglaze', auth.isAuthenticated, imageUpload.single('image'), post.createGlaze);


router.post('/deletePost/:id', auth.isAuthenticated, auth.isAdmin, post.deletePost);

router.get('/editPost/:id', auth.isAuthenticated, post.editPost); 
router.post('/editPost/:id', auth.isAuthenticated, post.savePost);


export default router;
