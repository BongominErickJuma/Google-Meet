// end.js
import { SpacesServiceClient } from "@google-apps/meet";
import { meetDetails } from "../index.js";

async function callEndActiveConference(authClient) {
  // Ensure meetDetails is populated before using it
  if (!meetDetails) {
    console.log("Meet details not available yet");
    return;
  }

  let name = meetDetails.name;

  const meetClient = new SpacesServiceClient({
    authClient: authClient,
  });

  // Construct request
  const request = {
    name,
  };
  // Run request
  const response = await meetClient.endActiveConference(request);
  console.log(response);
}

export default callEndActiveConference;
