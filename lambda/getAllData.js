import { docClient, createResponse, ScanCommand, getObjectURL} from "../../nodejs/utils.mjs"


export async function getAllPublications(event){
    try {
        const command = new ScanCommand({ TableName: "agro-forecast" })
        const filesData = await docClient.send(command)

        // let pdfGetUrl = getObjectURL(process.env.bucketName, filesData.Items.pdfKey)
        // let thumbnailGetUrl = getObjectURL(process.env.bucketName, filesData.Items.pdfCoverImgKey)

        return createResponse(200, {
            success: "All feilds fetched successfully!",
            filesData: filesData.Items,
            // filesUrl:{
            //     pdfGetUrl: JSON.parse(filesData.Items),
            //     thumbnailGetUrl: filesData.Items.pdfCoverImgKey
            // }
        })
    } catch (err) {
        return createResponse(500, {
            error: `Failed to fetched data from dynamodb\n${err}`
        })
    }
}