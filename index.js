const express = require("express");
const app = express();

app.get("/Home", (req, res) => {
  return res.status(200).json("Welocme to Home Page  ");
});

app.post("/home", (req, res) => {
  try {
    const user = [
      {
        name: "Anand",
        age: 23,
      },
    ];

    if (user.name === "Anand") {
      return res.status(200).json("You data Seccessfully Submitted!");
    }

    return res.status(404).json("Name is not found!");
  } catch (err) {
    return res.status(500).json("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log(`My NodeJS Server is ready on Port No ${3000}`);
});




