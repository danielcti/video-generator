const NewsAPI = require("newsapi");

const key = process.env.NEWS_API_API_KEY || "";

const newsapi = new NewsAPI(key);

const getTrendingNews = async (sources = "techcrunch") => {
  const data = await newsapi.v2.topHeadlines({
    sources,
    language: "en",
  });

  return data;
};

const getLatestTrendingNews = async () => {
  const data = await getTrendingNews();

  return data.articles[3];
};

module.exports = { getLatestTrendingNews };
