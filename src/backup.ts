import { Utils } from './utils/utils'

const backup = async () => {
const utils = new Utils;
const videoList = await utils.getVideoUrls();
const containerName = `videos`
const container = await utils.getAzureContainer(containerName);
for ( const i in videoList) {
    if (videoList && videoList[i] && videoList[i].url) {
        const videoReadStream = await utils.getVideoStreamFromUri(videoList[i].url)
        const blobName = `${videoList[i].title}-${videoList[i].videoId}.mp4`
        await utils.uploadStreamToBlob(container, videoReadStream, blobName);
        } 
    }
}
  
backup();