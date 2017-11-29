
const Minio = require("minio");

const MINIO_CONFIG = require("../../config/minio.json");


let minioClient = new Minio.Client(MINIO_CONFIG);

module.exports = minioClient;
