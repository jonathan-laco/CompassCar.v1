const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const MIN_YEAR = 2015;
const MAX_YEAR = 2025;

const validateCarData = (brand, model, year) => {
    if (!brand) return 'brand is required';
    if (!model) return 'model is required';
    if (!year) return 'year is required';
    if (year < MIN_YEAR || year > MAX_YEAR) {
        return `year should be between ${MIN_YEAR} and ${MAX_YEAR}`;
    }
    return null;
};

router.post('/', async (req, res) => {
    const { brand, model, year, items } = req.body;

    const validationError = validateCarData(brand, model, year);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "At least one item is required" });
    }

    const existingCar = await prisma.car.findUnique({
        where: { brand_model_year: { brand, model, year } },
    });

    if (existingCar) {
        return res.status(409).json({ error: 'There is already a car with this data' });
    }

    try {
        const car = await prisma.car.create({
            data: {
                brand,
                model,
                year,
                items: {
                    create: items.map(item => ({ name: item })),
                },
            },
        });
        return res.status(201).json({ id: car.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error add car' });
    }
});

module.exports = router;
