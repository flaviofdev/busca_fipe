const fipeCache = require('../cache/fipeCache');
const Fuse = require('fuse.js');
const memoryCache = require('../utils/memoryCache');

const getAllBrands = async () => {
   const brands = await fipeCache.getBrands();
   if (!brands) return [];
   return brands.map(brand => ({
        id: brand.codigo,
        name: brand.nome
   }));
}

const getModelsByBrand = async (brandId) => {
    const models = await fipeCache.getModels(brandId);
    if (!models) return [];
    return models.map(model => ({
         id: model.codigo,
         name: model.nome
    }));
}

const getYearsByModel = async (brandId, modelId) => {
    const years = await fipeCache.getYears(brandId, modelId);
    if (!years) return [];
    return years.map(year => ({
         id: year.codigo,
         name: year.nome
    }));
}

const searchApproximate = async (query) => {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = memoryCache.getCache(cacheKey);
    if (cached) return cached;

    const brands = await fipeCache.getBrands();
    if (!brands) return [];

    const brandItems = brands.map(brand => ({
        type: 'brand',
        id: brand.codigo,
        name: brand.nome,
        fullName: brand.nome
    }));

    const fuse = new Fuse(brandItems, {
        keys: ['name', 'fullName'],
        threshold: 0.4
    });

    const results = fuse.search(query);
    const topBrand = results[0]?.item;

    if (topBrand?.type === 'brand') {
        const models = await fipeCache.getModels(topBrand.id);
        if (!models) return [topBrand];

        const modelItems = models.map(model => ({
            type: 'model',
            id: model.codigo,
            name: model.nome,
            brandId: topBrand.id,
            brandName: topBrand.name,
            fullName: `${topBrand.name} ${model.nome}`
        }));

        const modelFuse = new Fuse(modelItems, {
            keys: ['name', 'fullName'],
            threshold: 0.4
        });

        const modelResults = modelFuse.search(query);
        const final = modelResults.length ? modelResults.map(r => r.item) : [topBrand];
        memoryCache.setCache(cacheKey, final, 5 * 60 * 1000);
        return final;
    }

    const modelResults = await Promise.all(
        brands.map(async (brand) => {
            const models = await fipeCache.getModels(brand.codigo);
            if (!models) return [];

            return models.map(model => ({
                type: 'model',
                id: model.codigo,
                name: model.nome,
                brandId: brand.codigo,
                brandName: brand.nome,
                fullName: `${brand.nome} ${model.nome}`
            }));
        })
    );

    const allModelItems = modelResults.flat();

    const allModelFuse = new Fuse(allModelItems, {
        keys: ['name', 'fullName'],
        threshold: 0.4
    });

    const finalResults = allModelFuse.search(query);
    memoryCache.setCache(cacheKey, finalResults.map(r => r.item), 5 * 60 * 1000);
    return finalResults.map(r => r.item);
}

module.exports = {
    getAllBrands,
    getModelsByBrand,
    getYearsByModel,
    searchApproximate
}