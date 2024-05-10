import { ConferenceRecordsServiceClient } from "@google-apps/meet";

async function callListConferenceRecords(authClient) {
  const meetClient = new ConferenceRecordsServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {};

  // Run request
  const iterable = meetClient.listConferenceRecordsAsync(request);
  for await (const response of iterable) {
    console.log(response);
  }
}

export default callListConferenceRecords;
