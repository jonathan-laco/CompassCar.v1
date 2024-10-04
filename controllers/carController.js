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
