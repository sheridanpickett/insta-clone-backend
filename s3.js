const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const S3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

function uploadFile(file, objectKey) {
    const params = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: objectKey
    }
    return S3.send(new PutObjectCommand(params));
}

function getFile(objectKey) {
    const params = {
        Bucket: bucketName,
        Key: objectKey
    }
    return S3.send(new GetObjectCommand(params));
}

function deleteFile(objectKey) {
    const params = {
        Bucket: bucketName,
        Key: objectKey
    }
    return S3.send(new DeleteObjectCommand(params));
}

exports.getFile = getFile;
exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;