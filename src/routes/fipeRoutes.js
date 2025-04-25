const express = require('express');
const router = express.Router();
const fipeController = require('../controllers/fipeController');

router.post('/', fipeController.searchFipe);
router.get('/marcas', fipeController.listBrands);
router.get('/modelos/:brandId', fipeController.listModelsByBrand);

module.exports = router;