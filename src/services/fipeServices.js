const fipe = require('fipe-promise');

const getFipeData = async (car, maker, year) => {
    const brands = await fipe.fetchBrands(fipe.vehicleType.CARS);
    const brand = brands.find(b => b.nome.toLowerCase() === maker.toLowerCase());
    if (!brand) throw new Error('Marca não encontrada');

    const modelsData = await fipe.fetchModels(fipe.vehicleType.CARS, brand.codigo);
    const model = modelsData.find(m => m.nome.toLowerCase().includes(car.toLowerCase()));
    if (!model) throw new Error('Modelo não encontrado');

    const years = await fipe.fetchYears(fipe.vehicleType.CARS, brand.codigo, model.codigo);
    const yearModel = years.find(a => a.nome.includes(year));
    if (!yearModel) throw new Error('Ano não encontrado');

    const detail = await fipe.fetchDetail(
        fipe.vehicleType.CARS,
        brand.codigo,
        model.codigo,
        yearModel.codigo
    );

    return {
        car,
        maker,
        year,
        price: detail.Valor,
        model: detail.Modelo,
        fuel: detail.Combustível,
        fipe: detail.CodigoFipe
    }
}

const getAllBrands = async() => {
    const getAB = await fipe.fetchBrands(fipe.vehicleType.CARS);
    return getAB.map(brand => ({
        id: brand.codigo,
        name: brand.nome
    }));
}

const getModelsByBrand = async(brandID) => {
    const getMB = await fipe.fetchModels(fipe.vehicleType.CARS, brandID);
    console.log(getMB);
    return getMB.map(modelBrand => ({
        id: modelBrand.codigo,
        name: modelBrand.nome
    }));

}

module.exports = {
    getFipeData,
    getAllBrands,
    getModelsByBrand
}