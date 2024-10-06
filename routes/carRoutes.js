const express = require("express");
const carController = require("../controllers/carController");
const validateCreateCarRequest = require("../requests/carCreateRequest");
const validateUpdateCarRequest = require("../requests/carUpdateRequest");

const router = express.Router();

router.post("/", validateCreateCarRequest, carController.createCar);
router.delete("/:id", carController.deleteCar);
router.get("/:id", carController.getCar);
router.get("/", carController.listCars);
router.patch("/:id", validateUpdateCarRequest, carController.updateCar);

module.exports = router;
