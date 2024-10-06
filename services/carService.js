const { PrismaClient } = require("@prisma/client");
const {
  createCarSchema,
  updateCarSchema,
} = require("../validations/carValidation");

const prisma = new PrismaClient();

const createCar = async (brand, model, year, items) => {
  // Validar dados do carro usando Joi
  await createCarSchema.validateAsync({ brand, model, year, items });

  const existingCar = await prisma.car.findUnique({
    where: { brand_model_year: { brand, model, year } },
  });

  if (existingCar) {
    throw { status: 409, message: "There is already a car with this data" };
  }

  const uniqueItems = [...new Set(items)];

  const car = await prisma.car.create({
    data: {
      brand,
      model,
      year,
      items: {
        create: uniqueItems.map((item) => ({ name: item })),
      },
    },
  });
  return { status: 201, data: { id: car.id } };
};

const deleteCar = async (id) => {
  const carExists = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });
  if (!carExists) {
    throw { status: 404, message: "Car not found" };
  }
  await prisma.car.delete({ where: { id: parseInt(id) } });
};

const getCar = async (id) => {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });

  if (!car) {
    throw { status: 404, message: "Car not found" };
  }

  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    items: car.items.map((item) => item.name),
  };
};

// Refactored listCars
const listCars = async (page, limit, brand, model, year) => {
  const pageInt = parseInt(page);
  const limitInt = Math.min(Math.max(parseInt(limit), 1), 10);

  if (isNaN(pageInt) || pageInt < 1) {
    return {
      error: {
        status: 400,
        message: "ERROR! pages must be greater than 0",
      },
    };
  }
  const skip = (pageInt - 1) * limitInt;

  const filters = {};
  if (brand) filters.brand = { contains: brand };
  if (model) filters.model = { contains: model };
  if (year) filters.year = { gte: parseInt(year) };

  const totalCars = await prisma.car.count({ where: filters });

  const cars = await prisma.car.findMany({
    where: filters,
    skip,
    take: limitInt,
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      items: { select: { name: true } },
    },
  });

  const totalPages = Math.ceil(totalCars / limitInt);

  return {
    count: totalCars,
    pages: totalPages,
    data: cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      items: car.items.map((item) => item.name),
    })),
  };
};

// Refactored updateCar
const updateCar = async (id, { brand, model, year, items }) => {
  const carExists = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });

  if (!carExists) {
    throw { status: 404, message: "Car not found" };
  }

  // Validar dados do carro usando Joi
  await updateCarSchema.validateAsync({ brand, model, year, items });

  const validItems = items ? items.filter((item) => item.trim() !== "") : [];

  const updatedData = {
    brand: brand || carExists.brand,
    model: model || carExists.model,
    year: year || carExists.year,
    items:
      validItems.length > 0
        ? {
            deleteMany: {},
            create: [...new Set(validItems.map((item) => ({ name: item })))],
          }
        : undefined,
  };

  await prisma.car.update({
    where: { id: parseInt(id) },
    data: updatedData,
  });
};

module.exports = {
  createCar,
  deleteCar,
  getCar,
  listCars,
  updateCar,
};
