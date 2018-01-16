const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter
});

router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_product_by_id);

router.patch('/:productId', checkAuth, ProductController.products_patch_product);

router.delete('/:productId', checkAuth, ProductController.products_delete_product);

module.exports = router;