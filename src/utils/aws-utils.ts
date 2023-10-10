import { S3Client, ListBucketsCommand, CreateBucketCommand} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as dotenv from "dotenv";
import { Utils } from './common-utils'

dotenv.config();
let s3Client: any;
if (process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
    ) {
    const region = process.env.AWS_REGION
    const s3creds = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    s3Client = new S3Client({ region, 
        credentials: s3creds
    });
}

export class AmazonUtils extends Utils {

    getBucketNameList = async () => {
        const listBucketsCommand = new ListBucketsCommand({});
        const bucketListResponse = await s3Client.send(listBucketsCommand);
        let parsedBucketList = [];
        console.log(bucketListResponse.Buckets)
        if (bucketListResponse && bucketListResponse.Buckets.length > 0) { 
            const responseBuckets = bucketListResponse.Buckets
            for ( let i in responseBuckets) {
                parsedBucketList.push(responseBuckets[i].Name)
            }
        }
        return parsedBucketList
    }

    setSpaceName = async (containerName: string) => {
        console.log('\nCreating bucket...');
        console.log('\t', containerName);
        const bucketName = { 
            Bucket: containerName, 
          };
        const bucketNameList = await this.getBucketNameList();
        if(bucketNameList.includes(bucketName.Bucket) === false) { 
            const bucketCreationCommand = new CreateBucketCommand(bucketName);
            const bucketCreationResponse = await s3Client.send(bucketCreationCommand);
            console.log(bucketCreationResponse);
        } else {
            console.log("bucket was already created")
        }
        return bucketName.Bucket;
    }

    colorize = (color: number, output: string) => {
        return ['\x1b[', color, 'm', output, '\x1b[0m'].join('');
    }

    uploadStream = async (spaceName: any, stream: any, keyName: string) => {
          try {
            const parallelUploads3 = new Upload({
              client: s3Client,
              params: { Bucket: spaceName, Key: keyName, Body: stream },
            });
            parallelUploads3.on("httpUploadProgress", (progress: any) => {
                if (progress && progress.loaded) {
                    const progressPercent = Math.round(progress?.loaded / this.streamLength * 100)
                    process.stdout.write(this.colorize(35, `uploaded: ${progressPercent}%`))
                    process.stdout.cursorTo(this.previousStdoutCursorPosition);
                    if(progressPercent === 100) {
                        const completeCursor = this.previousStdoutCursorPosition +  `uploaded: ${progressPercent}%`.length;
                        process.stdout.cursorTo(completeCursor)
                        process.stdout.write(this.colorize(92, " complete! ✔"))
                        process.stdout.write("\n")
                    }
                }
            });
            await parallelUploads3.done();
          } catch (e) {
            console.log(e);
          }
    }
}