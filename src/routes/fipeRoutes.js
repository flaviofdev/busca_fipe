const express = require('express');
const router = express.Router();
const fipeController = require('../controllers/fipeController');

router.get('/marcas', fipeController.listBrands);
router.get('/marcas/:brandId/modelos/', fipeController.listModelsByBrand);
router.get('/marcas/:brandId/modelos/:modelId/anos', fipeController.listYearsByModel);
router.get('/marcas/:brandId/modelos/:modelId/anos/:yearId/busca', fipeController.searchFipe);

module.exports = router;