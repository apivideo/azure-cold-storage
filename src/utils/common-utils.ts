import ApiVideoClient from "@api.video/nodejs-client"
import axios from 'axios';
import * as dotenv from "dotenv";

dotenv.config();

const apivideoKey = process.env.APIVIDEO_API_KEY;
const apivideoClient = new ApiVideoClient({ apiKey: apivideoKey });

let VideoObjectList: { title: string; videoId: string; url: string; }

export abstract class Utils {

    previousStdoutCursorPosition: number;
    streamLength: number;

    constructor() {
        this.previousStdoutCursorPosition = 0;
        this.streamLength = 0;
      }
    
    getVideoUrls = async () => {
        const resVideoList = await apivideoClient.videos.list();
        let videoArrayList: any = []
        for(const i in resVideoList.data) {
            const videoListElement = resVideoList.data[i];
            if (videoListElement &&
                videoListElement.title &&
                videoListElement.videoId &&
                videoListElement.assets?.mp4) {
                let videoObject: typeof VideoObjectList = {
                    title: videoListElement.title,
                    url: videoListElement.assets.mp4,
                    videoId: videoListElement.videoId,
                } 
                videoArrayList.push(videoObject);
            }
        }  
        return videoArrayList
    }

    getVideoStreamFromUri = async (uri: string) => {
        const response = await axios.get(uri, {
        responseType: 'stream', 
            onDownloadProgress: progressEvent => {
                if(progressEvent && progressEvent.loaded && progressEvent.total) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    process.stdout.clearLine(0);
                    process.stdout.cursorTo(0);
                    const toPrint = `${uri} download: ${percentCompleted}%`
                    process.stdout.write(toPrint)
                    if(percentCompleted === 100) {
                        this.previousStdoutCursorPosition = toPrint.length + 1
                        process.stdout.cursorTo(this.previousStdoutCursorPosition);
                    }
            }
        }
    })
        this.streamLength = response.data[Object.getOwnPropertySymbols(response.data)[2]].length;
        return response.data
    }

    abstract setSpaceName(containerName: string): any

    abstract uploadStream(spaceName: any, stream: any, keyName: string): any
}
