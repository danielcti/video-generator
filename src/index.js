require("dotenv").config();

const { generateAndDownloadAudio } = require("./robots/elevenlabs");
const { buildVideo } = require("./robots/ffmpeg");
const { downloadImage } = require("./robots/imagedownloader");
const { getLatestTrendingNews } = require("./robots/newsapi");
const { summarizeText, createImages } = require("./robots/openai");
const { getNewsContent } = require("./robots/puppeteer");

const path = require("path");
const fs = require("fs");

const main = async () => {
  console.log("Starting the process...");
  console.log("Getting the latest news...");

  const latestNews = await getLatestTrendingNews();
  console.log("Latest news: ", latestNews.title);

  console.log("Getting the news content...");
  const paragraphs = await getNewsContent(latestNews.url);
  const validatedParagraphs = paragraphs.filter((p) => p.length > 40);
  console.log("News content paragraphs: ", validatedParagraphs.length);

  console.log("Summarizing the news...");
  const summarizedNews = await summarizeText(validatedParagraphs);
  console.log("Summarized news: ", summarizedNews);

  console.log("Creating the images...");
  const images = await createImages(validatedParagraphs);
  console.log("Images created: ", images.length);

  const folderName = latestNews.title.split(" ").join("-");

  console.log("Creating the folder...");
  if (!fs.existsSync(path.join(__dirname, "..", "results", folderName))) {
    fs.mkdirSync(path.join(__dirname, "..", "results", folderName));
  }
  console.log("Folder created successfully!");

  console.log("Downloading the images...");
  for (const [i, image] of images.filter((i) => !!i).entries()) {
    await downloadImage(
      image,
      path.join(__dirname, "..", "results", folderName, `image${i}.png`)
    );
  }
  console.log("Images downloaded successfully!");
  console.log("Generating the audio...");
  const fullText =
    typeof summarizedNews === "string"
      ? summarizedNews
      : summarizedNews.join(" ");
  await generateAndDownloadAudio(
    fullText,
    path.join(__dirname, "..", "results", folderName, "audio.mp3")
  );
  console.log("Audio generated successfully!");

  console.log("Writing the logs...");
  fs.writeFileSync(
    path.join(__dirname, "..", "results", folderName, "logs.json"),
    JSON.stringify(
      {
        title: latestNews.title,
        description: latestNews.description,
        summary: summarizedNews,
        paragraphs: validatedParagraphs,
        images,
      },
      null,
      2
    ),
    { flag: "a" }
  );
  console.log("Logs written successfully!");

  console.log("Building the video...");
  await buildVideo(
    images.map((image, i) =>
      path.join(__dirname, "..", "results", folderName, `image${i}.png`)
    ),
    path.join(__dirname, "..", "results", folderName, "audio.mp3"),
    path.join(__dirname, "..", "results", folderName, "video.mp4")
  );
  console.log("Video built successfully!");
};

main();
