const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint para atualizar carro
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { brand, model, year, items } = req.body;

    try {
        const carExists = await prisma.car.findUnique({ where: { id: parseInt(id) } });

        if (!carExists) {
            return res.status(404).json({ error: 'Car not found' });
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
        return res.status(500).json({ error: 'Error when updating car' });
    }
});

module.exports = router;
