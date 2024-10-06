const carService = require("../services/carService");

exports.createCar = async (req, res) => {
  const { brand, model, year, items } = req.body;

  try {
    const response = await carService.createCar(brand, model, year, items);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    await carService.deleteCar(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

exports.getCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await carService.getCar(id);
    return res.json(car);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

exports.listCars = async (req, res) => {
  const { page = 1, limit = 5, brand, model, year } = req.query;

  try {
    const response = await carService.listCars(page, limit, brand, model, year);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};

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
