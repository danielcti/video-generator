const { Configuration, OpenAIApi } = require("openai");

const key = process.env.OPEN_AI_API_KEY || "";

const configuration = new Configuration({
  apiKey: key,
});
const openai = new OpenAIApi(configuration);

const summarizeText = async (messages) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Given the following article already split into paragraphs, summarize it, try to group similar subjects in paragraphs, and return the result. My idea is to use this text for a 1 minute video. So try to fit the text within this timeframe. Also convert this text to a javascript array format. And fill this array with paragraphs(try to put together related subjects), i.e. [ 'foo', 'bar' ]",
      },
      ...messages.map((story) => ({
        role: "user",
        content: story,
      })),
    ],
  });
  return response.data.choices[0].message.content;
};

const createImages = async (prompts) => {
  const promises = prompts.map(async (p) => {
    try {
      const response = await openai.createImage({
        prompt: p,
        n: 1,
        size: "1024x1024",
      });
      return response.data.data[0].url;
    } catch (error) {
      console.error("error downloading image");
      return "";
    }
  });

  return Promise.all(promises);
};

module.exports = { summarizeText, createImages };
