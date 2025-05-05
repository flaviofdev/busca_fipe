const fipeService = require('../services/fipeServices');

const searchFipe = async (req, res) => {
    const { modelId, brandId, yearId } = req.params;

    if (!modelId || !brandId || !yearId) {
        return res.status(400).json({ error: 'Fill in all the fields!' });
    }

    try {
        const data = await fipeService.getFipeData(modelId, brandId, yearId);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error when checking FIPE table.' })
    }
}

const listBrands = async (req, res) => {
    try {
        const brands = await fipeService.getAllBrands();
        res.json(brands);
    } catch (error) {
        console.error('Error on listBrands:', error);
        res.status(500).json({ error: 'Error while searching brand in cache.' });
    }
}

const listModelsByBrand = async (req, res) => {
    const { brandId } = req.params;

    if(!brandId) {
        return res.status(400).json({ error: 'Brand ID required.' });
    }

    try {
        const models = await fipeService.getModelsByBrand(brandId);
        res.json(models);
    } catch (error) {
        console.error('Error on listModelsByBrand', error);
        res.status(500).json({ error: 'Error while searching brand models.' });
    }
}

const listYearsByModel = async (req, res) => {
    const { brandId, modelId } = req.params;

    if (!brandId || !modelId) {
        return res.status(400).json({ error: 'Brand ID and Model ID are required.' });
    }

    try {
        const years = await fipeService.getYearsByModel(brandId, modelId);
        res.json(years);
    } catch (error) {
        console.error('Error on listYearsNyModel:', error);
        res.status(500).json({ error: 'Error while searching years.' });
    }
}

const searchFipeApproximate = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'The query is required for the approximate search' });
    }

    try {
        const results = await fipeService.searchApproximate(query);
        res.json(results);
    } catch (error) {
        console.error('Error on searchFipeApproximate:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    listBrands,
    listModelsByBrand,
    searchFipe,
    listYearsByModel,
    searchFipeApproximate
}