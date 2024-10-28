import 'dotenv/config';

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const client = new S3Client({
    region: process.env.AWS_REGION
})

/*export async function createUploadUrl(key: string) {
    const command = new PutObjectCommand({ 
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        
    });

    return await getSignedUrl(client, command, {
        expiresIn: 600,
    });
}*/

export async function createUploadUrl(key: string) {
    const bucket = process.env.AWS_S3_BUCKET!;

    const { url, fields } = await createPresignedPost(client, {
        Bucket: bucket,
        Key: key,
        Fields: {
            key: key
        },
        Conditions: [
            ['content-length-range', 0, 1000 * 1000 * 10/*mb*/]
        ],
        Expires: 600
    });
    
    return { url, fields };
}

export async function createDownloadUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
    });

    return await getSignedUrl(client, command, {
        expiresIn: 600
    });
}