const ffprobe = require('node-ffprobe');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

ffprobe.FFPROBE_PATH = ffprobeInstaller.path;

exports.getAudioDurationInSeconds = async function (req, res) {
  try {
    const { audio_url } = req.body ?? {};
    console.log(`audio_url: ${audio_url}`);
    if (!audio_url) {
      res.sendStatus(400);
      return;
    }
    const durationInSeconds = await getDurationInSeconds(audio_url);
    console.log(
      `[INFO]::[${audio_url}] durationInSeconds: ${durationInSeconds}`
    );
    res.send(`${durationInSeconds}`);
  } catch (error) {
    const errMsg = error?.message ?? error;
    console.error(
      `[ERROR]::[${audio_url}] getAudioDurationInSeconds: ${errMsg}`
    );
    res.sendStatus(500);
  }
};

async function getDurationInSeconds(audioUrl) {
  if (!audioUrl) return 0;
  const probeData = await ffprobe(audioUrl);
  return Number(probeData?.streams[0]?.duration);
}
