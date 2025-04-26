const fipe = require('fipe-promise');

const getFipeData = async (carId, makerId, yearId) => {

    try {
        const detail = await fipe.fetchDetail(
            fipe.vehicleType.CARS,
            makerId,
            carId,
            yearId
        );

        return {
            price: detail.Valor,
            model: detail.Modelo,
            fuel: detail.Combustível,
            fipe: detail.CodigoFipe,
            ...detail
        }
    } catch (error) {
        console.log(error);
    }


}

const getAllBrands = async () => {
    const brandRes = await fipe.fetchBrands(fipe.vehicleType.CARS);
    return brandRes.map(brand => ({
        id: brand.codigo,
        name: brand.nome
    }));
}

const getModelsByBrand = async (brandId) => {
    const modelsRes = await fipe.fetchModels(fipe.vehicleType.CARS, brandId);
    console.log(modelsRes);
    return modelsRes.map(modelBrand => ({
        id: modelBrand.codigo,
        name: modelBrand.nome
    }));
}

const getYearsByModel = async (brandId, modelId) => {
    const years = await fipe.fetchYears(fipe.vehicleType.CARS, brandId, modelId);
    return years.map(year => ({
        id: year.codigo,
        name: year.nome
    }));
}

module.exports = {
    getFipeData,
    getAllBrands,
    getModelsByBrand,
    getYearsByModel
}