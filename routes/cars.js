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

// Endpoint para adicionar um carro (criar)
router.post('/', async (req, res) => {
    const { brand, model, year, items } = req.body;

    if (!brand || !model || !year || !items || items.length === 0) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const existingCar = await prisma.car.findUnique({
        where: { brand_model_year: { brand, model, year } },
    });

    if (existingCar) {
        return res.status(409).json({ error: 'there is already a car with this data' });
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
        return res.status(500).json({ error: 'Erro ao adicionar carro' });
    }
});

// Endpoint para listar carros
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 5, brand, model, year } = req.query;
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
            select: { id: true, brand: true, model: true, year: true },
        });

        return res.status(200).json({
            count: totalCars,
            data: cars,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao listar carros' });
    }
});

// Endpoint para buscar carro por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const car = await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: { items: true },
        });

        if (!car) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }

        return res.json({
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            items: car.items.map(item => item.name),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar carro' });
    }
});

// Endpoint para atualizar carro
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { brand, model, year, items } = req.body;

    try {
        const carExists = await prisma.car.findUnique({ where: { id: parseInt(id) } });

        if (!carExists) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }

        const updatedData = {
            brand: brand || carExists.brand,
            model: model || carExists.model,
            year: year || carExists.year,
            items: items ? {
                deleteMany: {},
                create: items.map(item => ({ name: item })),
            } : undefined,
        };

        await prisma.car.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
});

// Endpoint para excluir carro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const carExists = await prisma.car.findUnique({
            where: { id: parseInt(id) },
        });

        if (!carExists) {
            return res.status(404).json({ error: 'car not found' });
        }

        await prisma.car.delete({ where: { id: parseInt(id) } });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir carro' });
    }
});

module.exports = router;
