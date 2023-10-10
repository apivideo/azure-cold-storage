import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as dotenv from "dotenv";
import { Utils } from './common-utils'

dotenv.config();
// Enter your storage account name and shared key
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME ? process.env.AZURE_STORAGE_ACCOUNT_NAME : "";
const accountKey = process.env.AZURE_ACCOUNT_KEY ? process.env.AZURE_ACCOUNT_KEY : "";

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

export class AzureUtils extends Utils {

    setSpaceName = async (containerName: string) => {
        console.log('\nCreating container...');
        console.log('\t', containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const createContainerResponse = await containerClient.createIfNotExists();
        console.log(
        `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
        );
        return containerClient;
    }

    uploadStream = async (spaceName: any, stream: any, keyName: string) => {
        const blockBlobClient = await spaceName.getBlockBlobClient(keyName);
        console.log(
        `\nUploading to Azure storage as blob\n\tname: ${keyName}:\n\tURL: ${blockBlobClient.url}`
      );
        const uploadBlobResponse = await blockBlobClient.uploadStream(stream);
        console.log(uploadBlobResponse)
    }
}