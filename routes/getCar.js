const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint para buscar carro por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const car = await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: { items: true },
        });

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
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
        return res.status(500).json({ error: 'Error when searching for car' });
    }
});

module.exports = router;
