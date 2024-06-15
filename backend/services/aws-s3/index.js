const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const getPic = async (imageParams) => {
    try {
        console.log(`Getting image from bucket : ${imageParams.Bucket}, Key : ${imageParams.Key}`);

        console.log(`Access Key : ${process.env.AWS_ACCESS_KEY}`);
        return await s3.getObject(imageParams).promise();

    } catch (error) {
        console.log(error.message)
        return null
    }
} 

module.exports = {
    getPic,
    s3
}