import { ConferenceRecordsServiceClient } from "@google-apps/meet";
import { meetDetails } from "../index.js";

async function callGetConferenceRecord(authClient) {
  if (!meetDetails) {
    console.log("Meet details not available yet");
    return;
  }

  let name = meetDetails.activeconference;

  const meetClient = new ConferenceRecordsServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {
    name,
  };

  // Run request
  const response = await meetClient.getConferenceRecord(request);
  console.log(response);
}

export default callGetConferenceRecord;
