const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

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

        const totalCars = await prisma.car.count({
            where: filters
        });
        const cars = await prisma.car.findMany({
            where: filters,
            skip,
            take: limitInt,
            select: { id: true, brand: true, model: true, year: true },
        });

        if (totalCars === 0) {
            return res.status(204).send(); // No content
        }

        const totalPages = Math.ceil(totalCars / limitInt);

        return res.status(200).json({
            count: totalCars,
            pages: totalPages,
            data: cars,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao listar carros' });
    }
});

module.exports = router;
