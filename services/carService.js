const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const MIN_YEAR = 2015;
const MAX_YEAR = 2025;

const validateCarData = (brand, model, year) => {
  if (!brand) return "brand is required";
  if (!model) return "model is required";
  if (!year) return "year is required";
  if (year < MIN_YEAR || year > MAX_YEAR) {
    return `year should be between ${MIN_YEAR} and ${MAX_YEAR}`;
  }
  return null;
};

const createCar = async (brand, model, year, items) => {
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

const listCars = async (page, limit, brand, model, year) => {
  const pageInt = parseInt(page);
  const limitInt = Math.min(Math.max(parseInt(limit), 1), 10);
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

const updateCar = async (id, { brand, model, year, items }) => {
  const carExists = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });
  if (!carExists) {
    throw { status: 404, message: "Car not found" };
  }

  if (year && (year < MIN_YEAR || year > MAX_YEAR)) {
    throw {
      status: 400,
      message: `year should be between ${MIN_YEAR} and ${MAX_YEAR}`,
    };
  }

  const updatedData = {
    brand: brand || carExists.brand,
    model: model || carExists.model,
    year: year || carExists.year,
    items: items
      ? {
          deleteMany: {},
          create: [...new Set(items.map((item) => ({ name: item })))],
        }
      : undefined,
  };

  await prisma.car.update({
    where: { id: parseInt(id) },
    data: updatedData,
  });
};

module.exports = {
  validateCarData,
  createCar,
  deleteCar,
  getCar,
  listCars,
  updateCar,
};
