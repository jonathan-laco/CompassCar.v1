const express = require("express");
const carRoutes = require("./routes/carRoutes");

const app = express();
app.use(express.json());

app.use("/api/v1/cars", carRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
