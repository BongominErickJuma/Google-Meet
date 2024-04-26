import { SpacesServiceClient } from "@google-apps/meet";
import { meetDetails } from "../index.js";

// changing its possible access type

const space = {
  name: meetDetails.meetname,
};

async function callUpdateSpace(authClient) {
  const meetClient = new SpacesServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {
    space,
  };

  // Run request
  const response = await meetClient.updateSpace(request);
  console.log(response);
  console.log(`Meet URL UPDATE: ${response[0].meetingUri}`);
}

export default callUpdateSpace;
