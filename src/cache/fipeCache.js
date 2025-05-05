const redis = require('./redisClient')
const fipe = require('fipe-promise');

const CACHE_KEYS = {
    BRANDS: 'fipe:brands',
    MODELS: 'fipe:models',
    YEARS: 'fipe:years',
};

async function getBrands() {
    try {
        const cached = await redis.get(CACHE_KEYS.BRANDS);
        if (cached) return JSON.parse(cached);

        const brands = await fipe.fetchBrands(fipe.vehicleType.CARS, brandId);
        await redis.set(CACHE_KEYS.BRANDS, JSON.stringify(brands));
        return brands;
    } catch (error) {
        console.error('Erro while searching brands from Redis', error);
        return null;
    }
}

async function getModels(brandId) {
    try {
        const cacheKey = `${CACHE_KEYS.MODELS}:${brandId}`;
        let data = await redis.get(cacheKey);

        if (!data) {
            const models = await fipe.fetchModels(fipe.vehicleType.CARS, brandId);
            await redis.set(cacheKey, JSON.stringify(models));
            return models;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro while searching models from Redis', error);
        return null;
    }
}

async function getYears(brandId, modelId) {
    try {
        const cacheKey = `${CACHE_KEYS.YEARS}:${brandId}:${modelId}`;
        let data = await redis.get(cacheKey);

        if (!data) {
            const years = await fipe.fetchYears(fipe.vehicleType.CARS, brandId, modelId);
            await redis.set(cacheKey, JSON.stringify(years));
            return years;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro while searching years from Redis', error);
        return null;
    }
}

const getFipeData = async (brandId, modelId, yearId) => {
    try {
        const data = await fipe.fetchDetail(fipe.vehicleType.CARS, brandId, modelId, yearId);

        return {
            price: data.Valor,
            brand: data.Marca,
            model: data.Modelo,
            modelYear: data.AnoModelo,
            fuel: data.Combustivel,
            codeFipe: data.CodigoFipe
        }
    } catch (error) {
        console.error('Error fetching FIPE details:', error);
        throw new Error('Failed to fetch FIPE data');
    }
}

module.exports = {
    getBrands,
    getModels,
    getYears,
    getFipeData
}