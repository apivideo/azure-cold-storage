import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import axios from 'axios';
import ApiVideoClient from "@api.video/nodejs-client"
import * as dotenv from "dotenv";

dotenv.config();
// Enter your storage account name and shared key
const account = process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME ? process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME : "error";
const accountKey = process.env.AZURE_ACCOUNT_KEY ? process.env.AZURE_ACCOUNT_KEY : "error";
const apivideoKey = process.env.APIVIDEO_API_KEY;

const apivideoClient = new ApiVideoClient({ apiKey: apivideoKey });

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);
let VideoObjectList: { title: string; videoId: string; url: string; }

export class Utils {

    getVideoUrls = async () => {
        const resVideoList = await apivideoClient.videos.list();
        let videoArrayList: any = []
    
        for(const i in resVideoList.data) {
            const videoListElement = resVideoList.data[i];
            console.log(videoListElement)
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
                    process.stdout.write(`Uploading: ${percentCompleted}%`)
            }
        }
    })
        return response.data
    }

    getAzureContainer = async (containerName: string) => {
        console.log('\nCreating container...');
        console.log('\t', containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const createContainerResponse = await containerClient.createIfNotExists();
        console.log(
        `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
        );
        return containerClient;
    }

    uploadStreamToBlob = async (container: any, stream: any, blobName: string) => {
        const blockBlobClient = await container.getBlockBlobClient(blobName);
        console.log(
        `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
      );
        const uploadBlobResponse = await blockBlobClient.uploadStream(stream);
        console.log(uploadBlobResponse)
    }
}