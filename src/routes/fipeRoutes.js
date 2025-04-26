const express = require('express');
const router = express.Router();
const fipeController = require('../controllers/fipeController');

router.post('/', fipeController.searchFipe);
router.get('/marcas', fipeController.listBrands);
router.get('/marcas/:brandId/modelos/', fipeController.listModelsByBrand);
router.get('/marcas/:brandId/modelos/:modelId/anos', fipeController.listYearsByModel);

module.exports = router;