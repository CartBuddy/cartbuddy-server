
const Minio = require("minio");

const MINIO_CONFIG = require("../../config/minio.json");

const BUCKET_NAME = "cartbuddy";

let minioClient = new Minio.Client(MINIO_CONFIG);

module.exports = {
    minioClient: minioClient,
    BUCKET_NAME: BUCKET_NAME
};
