const fipeCache = require('../cache/fipeCache');
const Fuse = require('fuse.js');

// const getFipeData = async (carId, makerId, yearId) => {

//     try {
//         const detail = await fipe.fetchDetail(
//             fipe.vehicleType.CARS,
//             makerId,
//             carId,
//             yearId
//         );

//         return {
//             price: detail.Valor,
//             model: detail.Modelo,
//             fuel: detail.Combustível,
//             fipe: detail.CodigoFipe,
//             ...detail
//         }
//     } catch (error) {
//         console.log(error);
//     }


// }

const getAllBrands = async () => {
    const brands = await fipeCache.getBrands();
    if (!brands) throw new Error('No brands found in the cache.');
    return brands.map(brand => ({
        id: brand.codigo,
        name: brand.nome
    }));
}

const getModelsByBrand = async (brandId) => {
    const models = await fipeCache.getModels(brandId);
    if (!models) throw new Error(`No models found to the brand ID: ${brandId}`);
    return models.map(model => ({
        id: model.codigo,
        name: model.nome
    }));
}

const getYearsByModel = async (brandId, modelId) => {
    const models = await fipeCache.getYodels(brandId, modelId);
    if (!yearss) throw new Error(`No years found to the model ID: ${modelId}`);
    return years.map(year => ({
        id: year.codigo,
        name: year.nome
    }));}

const searchApproximate = async (query) => {
    const brands = await fipeCache.getBrands();
    if (!brands) throw new Error('Brands cache empty.');

    const brandList = brands.map(brand => ({
        type: 'brand',
        id: brand.codigo,
        name: brand.nome
    }));

    let modelList = [];
    for (const brand of brands) {
        const models = await fipeCache.getModels(brand.codigo);
        if (models) {
            const mappedModels = models.map(model => ({
                type:'model',
                id: model.codigo,
                name: model.nome,
                brandId: brand.codigo,
                brandName: brand.nome
            }));
            modelList = modelList.concat(mappedModels);
        }
    }

    const allItems = [...brandList, ...modelList];

    const fuse = new Fuse(allItems, {
        keys: ['name'],
        threshold: 0.4 // <- search sense, the lesser the more accurate 
    });

    const results = fuse.search(query);
    return results.map(r => r.item);
}

module.exports = {
    getAllBrands,
    getModelsByBrand,
    getYearsByModel,
    searchApproximate
}