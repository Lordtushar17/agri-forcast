const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const data = require("./data.json");

const client = new DynamoDBClient({ region: "ap-south-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "agro-forecast";

async function uploadData() {
  for (const item of data) {
    const itemWithPK = {
      fid: Date.now().toString() + Math.random(),
      ...item,
    };
    console.log("Uploading item:", itemWithPK);
    try {
      await ddbDocClient.send(
        new PutCommand({
          TableName: tableName,
          Item: itemWithPK,
        })
      );
      console.log(`Uploaded item with id: ${itemWithPK.id}`);
    } catch (err) {
      console.error("Error uploading item:", err);
    }
  }
}

uploadData();
