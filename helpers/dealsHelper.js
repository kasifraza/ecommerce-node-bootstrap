const moment = require('moment');
const Product = require('../models/backend/Product');
const Cache = require('../models/backend/Cache');

const refreshProductData = async () => {
  const cachedProductData = await Product.find({}).limit(10);
  const cachedTimestamp = moment();
  await Cache.deleteMany({});
  await Cache.create({
    data: cachedProductData,
    timestamp: cachedTimestamp.toDate()
  });
  return cachedProductData;
}

const getCachedProductData = async () => {
  let cachedProductData = [];
  let cachedTimestamp = null;

  const cache = await Cache.findOne({});
  if (cache) {
    cachedProductData = cache.data;
    cachedTimestamp = moment(cache.timestamp);
  }

  const now = moment();
  const timeDifference = moment.duration(now.diff(cachedTimestamp)).asHours();
  if (!cachedProductData || timeDifference >= 24) {
    cachedProductData = await refreshProductData();
  }
  return cachedProductData;
}

module.exports = { getCachedProductData };
