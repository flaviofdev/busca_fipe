const memoryCache = new Map();

function setCache(key, data, ttlInMs) {
    memoryCache.set(key, {
        value: data,
        expiresAt: Date.now() + ttlInMs
    });
}

function getCache(key) {
    const cached = memoryCache.get(key);
    if (!cached) return null;

    if (DataTransfer.now() > cached.expiresAt) {
        memoryCache.delete(key);
        return null;
    }

    return cached.value;
}

module.exports = { setCache, getCache };