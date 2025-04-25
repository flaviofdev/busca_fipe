const fipeService = require('../services/fipeServices');

const searchFipe = async (req, res) => {
    const { car, maker, year } = req.body;

    if (!car || !maker || !year) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    try {
        const data = await fipeService.getFipeData(car, maker, year);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Erro ao consultar tabela.' })
    }
}

const listBrands = async (req, res) => {
    try {
        const brands = await fipeService.getAllBrands();
        res.json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar marcas.' });
    }
}

const listModelsByBrand = async (req, res) => {
    const { brandId } = req.params;

    try {
        const models = await fipeService.getModelsByBrand(brandId);
        res.json(models);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar modelos da marca.' });
    }
}

module.exports = {
    listBrands,
    listModelsByBrand,
    searchFipe
}