const redis = require('./redisClient')
const fipe = require('fipe-promise');

const CACHE_KEYS = {
    BRANDS: 'fipe:brands',
    MODELS: 'fipe:models',
    YEARS: 'fipe:years',
};

async function refreshCache() {
    try {
        const brands = await fipe.fetchBrands(fipe.vehicleType.CARS);
        await redis.set(CACHE_KEYS.BRANDS, JSON.stringify(brands));
    
        for (const brand of brands) {
            const models = await fipe.fetchModels(fipe.vehicleType.CARS, brand.codigo);
            await redis.set(`${CACHE_KEYS.MODELS}:${brand.codigo}`, JSON.stringify(models));
    
            for (const model of models) {
                const years = await fipe.fetchYears(fipe.vehicleType.CARS, brand.codigo, model.codigo);
                await redis.set(`${CACHE_KEYS.YEARS}:${brand.codigo}:${model.codigo}`, JSON.stringify(years));
            }
        }
        console.log('Redis cache updated.');
    } catch (error) {
        console.error('Error while updating Redis cache:', error);
    }

}

async function getBrands() {
    try {
    const data = await redis.get(CACHE_KEYS.BRANDS);
    return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro while searching brands from Redis', error);
        return null;
    }
}

async function getModels(brandId) {
    try {
        const data = await redis.get(`${CACHE_KEYS.MODELS}:${brandId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro while searching models from Redis', error);
        return null;
    }
}

async function getYears(brandId, modelId) {
    try {
        const data = await redis.get(`${CACHE_KEYS.YEARS}:${brandId}:${modelId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro while searching years from Redis', error);
        return null;
    }
}

module.exports = {
    refreshCache,
    getBrands,
    getModels,
    getYears
}