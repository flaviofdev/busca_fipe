const fipeCache = require('../cache/fipeCache');
const Fuse = require('fuse.js');

const getAllBrands = async () => {
   return await fipeCache.getBrands(); 
}

const getModelsByBrand = async (brandId) => {
    return await fipeCache.getModels(brandId);
}

const getYearsByModel = async (brandId, modelId) => {
    return await fipeCache.getYears(brandId, modelId);
}

const searchApproximate = async (query) => {
    const brands = await fipeCache.getBrands();
    if (!brands) return [];

    const brandItems = brands.map(brand => ({
        type: 'brand',
        id: brand.codigo,
        name: brand.nome
    }));

    const fuse = new Fuse(brandItems, {
        keys: ['name'],
        threshold: 0.4
    });

    const results = fuse.search(query);
    const topMatch = results[0]?.item;

    if (topMatch?.type === 'brand') {
        const models = await fipeCache.getModels(topMatch.id);
        if (!models) return [topMatch];

        const modelItems = models.map(model => ({
            type: 'model',
            id: model.codigo,
            name: model.nome,
            brandId: topMatch.id,
            brandName: topMatch.name
        }));

        const modelFuse = new Fuse(modelItems, {
            keys: ['name'],
            threshold: 0.4
        });

        const modelResults = modelFuse.search(query);
        return modelResults.length ? modelResults.map(r => r. item) : [topMatch];
    }

    return results.map(r => r.item);
}

module.exports = {
    getAllBrands,
    getModelsByBrand,
    getYearsByModel,
    searchApproximate
}