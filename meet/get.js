import { SpacesServiceClient } from "@google-apps/meet";
import { meetDetails } from "../index.js";

async function callGetSpace(authClient) {
  if (!meetDetails) {
    console.log("Meet details not available yet");
    return;
  }

  let name = meetDetails.meetname;

  const meetClient = new SpacesServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {
    // Assuming `name` is defined elsewhere in your code
    name,
  };

  // Run request
  const response = await meetClient.getSpace(request);
  console.log(response);
}

export default callGetSpace;
