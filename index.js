import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import authorize from "./meet.js";
import callCreateSpace from "./meet/create.js";
import callEndActiveConference from "./meet/end.js";
import callGetSpace from "./meet/get.js";
import callListConferenceRecords from "./conference/allConference.js";
import callGetConferenceRecord from "./conference/specificConference.js";
import callListParticipants from "./participants/allParticipants.js";
import callListRecordings from "./recordings/allRecordings.js";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "meet",
  password: "erc3L@bo",
  port: 5432,
});

db.connect();

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let meetDetails = [];

async function fetchMeetings() {
  try {
    const res = await db.query("SELECT * FROM meetings");
    meetDetails = res.rows[0];
    return meetDetails;
  } catch (err) {
    console.log("Error Fetching data: ", err);
  }
}

meetDetails = await fetchMeetings();
export { meetDetails };

app.get("/", (req, res) => {
  // res.render("index.ejs", { title: "Home" });
  res.render("index.ejs", { title: "Home" });
});
app.get("/meetings", (req, res) => {
  res.render("admin/meetings.ejs", {
    title: "Meetings",
    meetDetails: meetDetails,
  });
});
app.get("/conferences", (req, res) => {
  res.render("admin/conferences.ejs", { title: "Conferences" });
});

app.get("/participants", (req, res) => {
  res.render("admin/participants.ejs", { title: "Participants" });
});

app.get("/artifacts", (req, res) => {
  res.render("admin/artifacts.ejs", { title: "Artifacts" });
});

// create meeting

app.post("/create", async (req, res) => {
  meetDetails = await authorize().then(callCreateSpace).catch(console.error);

  let spaceName = meetDetails[0].name;
  let meetingUri = meetDetails[0].meetingUri;
  let meetingCode = meetDetails[0].meetingCode;

  try {
    const result = await db.query(
      `UPDATE meetings SET name = $1, meetingUri = $2,meetingCode = $3 RETURNING *`,
      [spaceName, meetingUri, meetingCode]
    );

    const data = result.rows[0];
    meetDetails = data;
    res.redirect("/meetings");
  } catch (error) {
    console.log("Internal server error", error);
  }
});

// end meetings

app.post("/end", async (req, res) => {
  // console.log(meetDetails.meetname);
  await authorize().then(callEndActiveConference).catch(console.error);

  res.redirect("/meetings");
});

// get meeting information
app.post("/get", async (req, res) => {
  // console.log(meetDetails.meetname);
  meetDetails = await authorize().then(callGetSpace).catch(console.error);
  let activeConference = meetDetails[0].activeConference["conferenceRecord"];
  let spaceName = meetDetails[0].name;
  let meetingUri = meetDetails[0].meetingUri;
  let meetingCode = meetDetails[0].meetingCode;

  try {
    const result = await db.query(
      `UPDATE meetings SET name = $1, meetingUri = $2,meetingCode = $3, activeConference = $4 RETURNING *`,
      [spaceName, meetingUri, meetingCode, activeConference]
    );

    const data = result.rows[0];
    meetDetails = data;
    res.redirect("/meetings");
  } catch (error) {
    console.log("Internal server error", error);
  }
});

// Conferences

app.post("/getAllConferences", async (req, res) => {
  // console.log(meetDetails.meetname);
  await authorize().then(callListConferenceRecords).catch(console.error);
  res.redirect("/conferences");
});

app.post("/getSpecificConference", async (req, res) => {
  // console.log(meetDetails.meetname);
  await authorize().then(callGetConferenceRecord).catch(console.error);
  res.redirect("/conferences");
});

// participants

app.post("/getAllParticipants", async (req, res) => {
  await authorize().then(callListParticipants).catch(console.error);
  res.redirect("/participants");
});

app.post("/getAllRecordings", async (req, res) => {
  await authorize().then(callListRecordings).catch(console.error);
  res.redirect("/artifacts");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
