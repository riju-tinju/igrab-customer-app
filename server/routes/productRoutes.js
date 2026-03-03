const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/search', productController.getProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
