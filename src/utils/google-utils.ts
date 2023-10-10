import {Storage} from '@google-cloud/storage'
import * as dotenv from "dotenv";
import { Utils } from './common-utils'


dotenv.config();

const googleKey = JSON.parse(process.env.GCP_KEY ? process.env.GCP_KEY : "");
const storage = new Storage({credentials: googleKey});

export class GoogleStorageUtils extends Utils {

    getBucketList = async (buckets: any) => {
        let finalBucketList = []
        if (buckets[0].length > 0) {
            for (let i in buckets[0]) {
                finalBucketList.push(buckets[0][i]?.id);
            }
        }
        return finalBucketList;
    }

    setSpaceName = async (containerName: string) => {
        console.log('\nCreating container...');
        console.log('\t', containerName);
        const buckets = await storage.getBuckets();
        const bucketList = await this.getBucketList(buckets)
        if(bucketList.includes(containerName) === false) {
            await storage.createBucket(containerName);
            console.log(`Bucket ${containerName} created.`);
        } else {
            console.log("bucket already exists")
        }
        return containerName;
    }

    uploadStream = async (spaceName: any, stream: any, keyName: string) => {    
        const storageBucket = storage.bucket(spaceName);
        const file = storageBucket.file(keyName);
        const streamPipe = await stream.pipe(file.createWriteStream());
        streamPipe.on('finish', () => {
           console.log(`${keyName} uploaded to ${spaceName} successfully`);
          });
    }
}