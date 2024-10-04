const express = require("express");
const carController = require("../controllers/carController");

const router = express.Router();

router.post("/", carController.createCar);
router.delete("/:id", carController.deleteCar);
router.get("/:id", carController.getCar);
router.get("/", carController.listCars);
router.patch("/:id", carController.updateCar);

module.exports = router;
