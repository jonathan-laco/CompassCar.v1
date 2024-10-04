const carService = require("../services/carService");

exports.createCar = async (req, res) => {
  const { brand, model, year, items } = req.body;
  const validationError = carService.validateCarData(brand, model, year);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "At least one item is required" });
  }

  try {
    const response = await carService.createCar(brand, model, year, items);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
// function deleteCar
exports.deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    await carService.deleteCar(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

// function getCar
exports.getCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await carService.getCar(id);
    return res.json(car);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
// finction listCars

exports.listCars = async (req, res) => {
  const { page = 1, limit = 5, brand, model, year } = req.query;

  try {
    const response = await carService.listCars(page, limit, brand, model, year);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
// function updateCar

exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const { brand, model, year, items } = req.body;

  try {
    await carService.updateCar(id, { brand, model, year, items });
    return res.status(204).send();
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
