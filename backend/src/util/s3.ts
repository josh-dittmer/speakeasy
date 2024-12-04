import 'dotenv/config';

import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Response } from 'express';
import { maxFileSize } from 'models';

const client = new S3Client({
    region: process.env.AWS_REGION,
});

export async function createUploadUrl(key: string) {
    const bucket = process.env.AWS_S3_BUCKET!;

    const { url, fields } = await createPresignedPost(client, {
        Bucket: bucket,
        Key: key,
        Fields: {
            key: key,
        },
        Conditions: [['content-length-range', 0, maxFileSize]],
        Expires: 600,
    });

    return { url, fields };
}

export async function fileExists(key: string) {
    const command = new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    try {
        await client.send(command);
    } catch {
        return false;
    }

    return true;
}

export async function streamDownload(res: Response, key: string, mimeType: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    const response = await client.send(command);

    res.setHeader('Content-Type', mimeType);

    const stream: WritableStream = new WritableStream({
        write: chunk => {
            res.write(chunk);
        },
        close: () => {
            res.end();
        },
        abort: err => {
            console.log(err);
            res.end();
        },
    });

    response.Body?.transformToWebStream().pipeTo(stream);
}

export async function deleteFile(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    await client.send(command);
}

export async function createDownloadUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    return await getSignedUrl(client, command, {
        expiresIn: 600,
    });
}
