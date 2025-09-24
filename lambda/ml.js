import {
  docClient,
  PutCommand,
  createResponse,
} from "../../nodejs/utils.mjs";

export async function postAgriData(event) {

  if (event.httpMethod == "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173", // Replace with your frontend URL or use "*"
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({})
    };
  }


  try {
    let { temp, humidity, 
        soil_moist, ref_evapotranspiration,  
        evapotranspiration, crop_coefficient,
        nitrogen, phosphorus,
        solar_radiation, potassium, 
        ph, wind_speed
    } = JSON.parse(event.body);
    let fid = Date.now().toString() + Math.random()


    let command = new PutCommand({
      TableName: "agro-forecast",
      Item: {
        fid, temp, humidity, 
        soil_moist, ref_evapotranspiration,  
        evapotranspiration, crop_coefficient,
        nitrogen, phosphorus,
        solar_radiation, potassium, 
        ph, wind_speed,
        timestamp: Date.now()
      },
    });

    const response = await docClient.send(command);

    if(!response) return createResponse(500, { error: "Failed to insert data in dynamodb" });

    return createResponse(
      200,
      { 
        success: "Agri data inserted successfully",
      }
    );

  } catch (err) {
    if (err.message === "The conditional request failed")
      return createResponse(409, { error: "User already exists!" });
    else
      return createResponse(500, {
        error: `Internal Server Error! ${err}`
      });
  }
}
