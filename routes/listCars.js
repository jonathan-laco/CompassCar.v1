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

        // Adiciona a seleção do campo 'items' para retornar os itens relacionados ao carro
        const cars = await prisma.car.findMany({
            where: filters,
            skip,
            take: limitInt,
            select: { 
                id: true,
                brand: true,
                model: true,
                year: true,
                items: { 
                    select: {
                        name: true 
                    }
                }
            },
        });

        if (totalCars === 0) {
            return res.status(204).send(); 
        }

        const totalPages = Math.ceil(totalCars / limitInt);

        // Mapeia os dados para incluir o campo 'items' como um array de strings
        return res.status(200).json({
            count: totalCars,
            pages: totalPages,
            data: cars.map(car => ({
                id: car.id,
                brand: car.brand,
                model: car.model,
                year: car.year,
                items: car.items.map(item => item.name) 
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao listar carros' });
    }
});

module.exports = router;
