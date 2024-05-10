import { ConferenceRecordsServiceClient } from "@google-apps/meet";
import { meetDetails } from "../index.js";

// Instantiates a client

async function callListParticipants(authClient) {
  if (!meetDetails) {
    console.log("Meet details not available yet");
    return;
  }

  let parent = meetDetails.activeconference;

  const meetClient = new ConferenceRecordsServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {
    parent,
  };

  // Run request
  const iterable = meetClient.listParticipantsAsync(request);
  for await (const response of iterable) {
    console.log(response);
  }
}

export default callListParticipants;
