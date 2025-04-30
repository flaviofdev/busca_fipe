const express = require('express');
const cors = require('cors');
const fipeRoutes = require('./routes/fipeRoutes');
const fipeCache = require('./cache/fipeCache');
const cron = require('node-cron');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/fipe', fipeRoutes);

(async () => {
    await fipeCache.refreshCache();
})();

cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Updating FIPE cache...');
    try {
        await fipeCache.refreshCache();
        console.log('[CRON] FIPE cache sucessfully updated.');
    } catch (error) {
        console.error('[CRON] Error while updating the cache:', error)
    }
});

module.exports = app;