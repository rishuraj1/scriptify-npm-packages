const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

class RealtimeVideoUploader {
    constructor(options) {
        this.s3Client = new S3Client({
            region: options.region,
            credentials: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
            },
        });
        this.bucketName = options.bucketName;
    }

    /**
     * Handle a single chunk and upload it immediately
     * @param {Buffer} chunk - The data chunk to upload
     * @param {string} chunkKey - The S3 key for this chunk
     */
    async handleData(chunk, chunkKey) {
        try {
            console.log(`Uploading chunk to key: ${chunkKey}`);
            await this.uploadChunk(chunk, chunkKey);
            console.log(`Successfully uploaded chunk to ${chunkKey}`);
        } catch (error) {
            console.error(`Error uploading chunk to ${chunkKey}: ${error}`);
        }
    }

    /**
     * Upload a single chunk to S3
     * @param {Buffer} chunk - The data chunk
     * @param {string} chunkKey - The S3 key for this chunk
     */
    async uploadChunk(chunk, chunkKey) {
        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucketName,
                Key: chunkKey,
                Body: chunk,
            },
        });

        await upload.done();
    }
}

module.exports = RealtimeVideoUploader;
