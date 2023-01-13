const express = require("express");
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Express server listening on Port: ${PORT}`)
})


