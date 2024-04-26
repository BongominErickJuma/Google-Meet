import { SpacesServiceClient } from "@google-apps/meet";

async function callCreateSpace(authClient) {
  const meetClient = new SpacesServiceClient({
    authClient: authClient,
  });
  // Construct request
  const request = {};

  // Run request
  const response = await meetClient.createSpace(request);
  return response;
}
export default callCreateSpace;
