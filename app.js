require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.status(200).send({
    message: "Hello World",
  });
});

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "obabs.taiwo@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

app.post("/sendMail", async (req, res) => {
  let news = [];
  let resp = await axios.get(
    "https://newsapi.org/v2/top-headlines?country=us&pageSize=23&apiKey=11305ebd74c446f099d59ccc489a9ed3"
  );

  if (resp.status != 200 || !resp.data.articles.length)
    return res.status(500).send({
      message: "Something went wrong",
    });
  news = resp.data.articles;
  const mailObj = {
    from: "obabs.taiwo@gmail.com",
    to: "lorddro001@gmail.com",
    subject: "Oluwaseunbabara Taiwo - News API Call",
    html: `
        <h3>${news[0].title}<h3/>
        <p>${news[0].description}</p>
        <h6>${news.length} Calls were made</h6>
    `,
  };

  transporter.sendMail(mailObj, (err, info) => {
    if (err) {
      return console.log(err);
    }
    res.status(200).send({ message: "Mail sent", message_id: info.messageId });
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
