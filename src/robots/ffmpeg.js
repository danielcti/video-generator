const ffmpeg = require("fluent-ffmpeg");
const { getVideoDurationInSeconds } = require("get-video-duration");

const buildVideo = async (images, audio, outputFilePath) => {
  const videoLengthInSeconds = await getVideoDurationInSeconds(audio).then(
    (duration) => {
      return duration;
    }
  );
  const timeInSecondForEachImage = videoLengthInSeconds / images.length;

  const command = ffmpeg();

  images.forEach((image) => {
    command
      .input(image)
      .inputOptions("-loop 1")
      .inputOptions("-t", timeInSecondForEachImage);
  });

  command.input(audio);

  command
    .complexFilter(`concat=n=${images.length}`)
    .audioCodec("copy")
    .videoCodec("libx264")
    .outputOptions("-pix_fmt", "yuv420p")
    .output(outputFilePath)
    // .on("end", () => {
    //   console.log("Video creation completed");
    // })
    .on("error", (err) => {
      console.error("Error creating video:", err);
    })
    // .on("progress", (progress) => {
    //   console.log(progress);
    // })
    .run();
};

module.exports = { buildVideo };
