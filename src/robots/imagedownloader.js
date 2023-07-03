const axios = require("axios");
const fs = require("fs");

async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  fs.writeFile(filename, response.data, (err) => {
    if (err) throw err;
  });
}

module.exports = { downloadImage };
