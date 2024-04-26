import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import authorize from "./meet.js";
import callCreateSpace from "./meet/create.js";
import callEndActiveConference from "./meet/end.js";
import callGetSpace from "./meet/get.js";

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

db.query("SELECT * FROM google", (err, res) => {
  if (err) {
    console.log("Error Fetching data: ", err);
  } else {
    meetDetails = res.rows[0];
  }
});

export { meetDetails };

app.get("/", (req, res) => {
  // res.render("index.ejs", { title: "Home" });
  res.render("index.ejs", { title: "Home" });
});
app.get("/admin", (req, res) => {
  res.render("admin/admin.ejs", { title: "Admin", meetDetails: meetDetails });
});
app.get("/users", (req, res) => {
  res.render("users/users.ejs", { title: "Users" });
});

// create meeting

app.post("/create", async (req, res) => {
  meetDetails = await authorize().then(callCreateSpace).catch(console.error);

  let spaceName = meetDetails[0].name;
  let meetingUri = meetDetails[0].meetingUri;
  let meetingCode = meetDetails[0].meetingCode;

  try {
    await db.query("DELETE FROM google");
    const result = await db.query(
      "INSERT INTO google (meeturl, meetname, meetcode) VALUES ($1, $2, $3) RETURNING *",
      [meetingUri, spaceName, meetingCode]
    );
    const data = result.rows[0];
    meetDetails = data;
    res.redirect("/admin");
  } catch (error) {
    console.log("internal server error", error);
  }
});

// end meetings

app.post("/end", async (req, res) => {
  // console.log(meetDetails.meetname);
  await authorize().then(callEndActiveConference).catch(console.error);
  res.redirect("/admin");
});

// get meeting information
app.post("/get", async (req, res) => {
  // console.log(meetDetails.meetname);
  await authorize().then(callGetSpace).catch(console.error);
  res.redirect("/admin");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
