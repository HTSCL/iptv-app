const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/login", async (req, res) => {
  const { server, username, password } = req.body;

  try {
    const response = await axios.get(
      `${server}/player_api.php?username=${username}&password=${password}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Connexion impossible" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
