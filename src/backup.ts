import { AzureUtils } from './utils/azure-utils'
import { AmazonUtils } from './utils/aws-utils'
import { GoogleStorageUtils } from './utils/google-utils'
import * as dotenv from "dotenv";
dotenv.config();

const spaceName = process.env.SPACE_NAME ? process.env.SPACE_NAME : "";

const checkProvider = (): any => {
    const provider = process.env.PROVIDER;
    switch(provider) {
        case 'azure':
            return new AzureUtils;
        case 'aws':
          return new AmazonUtils;
        case 'google':
            return new GoogleStorageUtils;
        default:
          console.log(`Invalid provider: ${provider}`)
      }
}

const backup = async () => {
const utils = checkProvider();
const videoList = await utils.getVideoUrls();
const space = await utils.setSpaceName(spaceName);
for ( const i in videoList) {
    if (videoList && videoList[i] && videoList[i].url) {
        const videoReadStream = await utils.getVideoStreamFromUri(videoList[i].url)
        const videoName = `${videoList[i].title}-${videoList[i].videoId}.mp4`
        await utils.uploadStream(space, videoReadStream, videoName);
        } 
    }
}

backup();