"use strict";
const AWS = require('aws-sdk');
const fs = require('fs');

const ACCESS_KEY = process.env.HOMEOPATHA_S3_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.HOMEOPATHA_S3_SECRET_ACCESS_KEY;
const REGION = process.env.HOMEOPATHA_S3_REGION;
const BUCKET_NAME = process.env.HOMEOPATHA_S3_BUCKET;

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION
});

class S3 {
    async uploadToS3(bucket=BUCKET_NAME, s3Path="", localFilePath="", options){
        try {

            if(!localFilePath || !localFilePath.trim().length){
                throw new Error('File path not defined.')
            }
            if(!s3Path || !s3Path.trim().length){
                throw new Error('Upload path not defined.')
            }

            const data_body = fs.createReadStream(localFilePath);

            const params = {
                Bucket: bucket,
                Key: s3Path,
                Body: data_body
            };

            let res = await s3.upload(params)

            return true

        } catch (error) {
            console.error(error)
        }
    }

    async fileUpload(file,path){
        try {
            const BUCKET = process.env.HOMEOPATHA_S3_BUCKET
            if(!BUCKET){
                throw new Error('No bucket name defined.')
            }
            const params = {
                Bucket: BUCKET,
                Key: path,
                Body: fs.createReadStream(file.path),
            };
            
            let res = await s3.upload(params).promise();
            return res
        } catch (error) {
            console.error(error);
        }
    }

    async filesList(path){
        try {
            const BUCKET = process.env.HOMEOPATHA_S3_BUCKET
            if(!BUCKET){
                throw new Error('No bucket name defined.')
            }
            const params = {
                Bucket: BUCKET,
                Prefix: path
            }
            let res = await s3.listObjectsV2(params).promise();
            return res.Contents.map(item => item.Key).map(e=>e.replace(path+'/',''))
        } catch (error) {
            console.error(error)
        }
    }

    async getDownloadLink(path){
        try {
            const BUCKET = process.env.HOMEOPATHA_S3_BUCKET
            if(!BUCKET){
                throw new Error('No bucket name defined.')
            }
            const params = {
                Bucket: BUCKET,
                Key: path,
                Expires: 600
            }
            const url = await s3.getSignedUrlPromise('getObject', params);
            return url
        } catch (error) {
            console.error(error)
        }
    }

    async emptyS3Directory(path) {
        const listParams = {
            Bucket: process.env.HOMEOPATHA_S3_BUCKET,
            Prefix: path
        };
    
        const listedObjects = await s3.listObjectsV2(listParams).promise();
    
        if (listedObjects.Contents.length === 0) return;
    
        const deleteParams = {
            Bucket: process.env.HOMEOPATHA_S3_BUCKET,
            Delete: { Objects: [] }
        };
    
        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });
    
        await s3.deleteObjects(deleteParams).promise();
    
        if (listedObjects.IsTruncated) await emptyS3Directory(process.env.HOMEOPATHA_S3_BUCKET, path);
    }
}

module.exports = S3;