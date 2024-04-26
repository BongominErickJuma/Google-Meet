import fetch from "node-fetch";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// get token
async function generateToken(tokenServerUrl, userID) {
  // Obtain the token interface provided by the App Server
  const response = await fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  return data.token;
}

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function getUrlParams(url) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

async function startMeeting() {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  const userID = randomID(5);
  const userName = "Bongomin";

  try {
    const token = await generateToken(
      "https://nextjs-token.vercel.app/api",
      userID
    );
    const generatedToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      1484647939,
      token,
      roomID,
      userID,
      userName
    );
    const zp = ZegoUIKitPrebuilt.create(generatedToken);

    // Perform further actions with zp...
    zp.joinRoom({
      // Your configuration here
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Entry point
startMeeting();
