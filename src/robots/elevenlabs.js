const axios = require("axios");
const fs = require("fs");

const key = process.env.ELEVEN_LABS_API_KEY || "";

const generateAndDownloadAudio = async (text, path) => {
  const response = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/ErXwobaYiN019PkySvjV",
    {
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    },
    {
      responseType: "arraybuffer",

      headers: {
        accept: "audio/mpeg",
        "xi-api-key": key,
        "Content-Type": "application/json",
      },
    }
  );
  fs.writeFile(path, response.data, (err) => {
    if (err) throw err;
    console.log("Audio downloaded successfully!");
  });
};

module.exports = { generateAndDownloadAudio };
