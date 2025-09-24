const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" });
const tableName = "agro-forecast";

async function scanAllItems() {
  let items = [];
  let lastEvaluatedKey = undefined;

  try {
    do {
      const params = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const command = new ScanCommand(params);
      const response = await client.send(command);

      if (response.Items) {
        items = items.concat(response.Items);
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log(`Total items retrieved: ${items.length}`);
    return items;

  } catch (err) {
    console.error("Error scanning table:", err);
  }
}

scanAllItems();
