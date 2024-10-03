const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const MIN_YEAR = 2015;
const MAX_YEAR = 2025;

// Endpoint para atualizar carro
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { brand, model, year, items } = req.body;

    try {
        const carExists = await prisma.car.findUnique({ where: { id: parseInt(id) } });

        if (!carExists) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Validação do ano
        if (year && (year < MIN_YEAR || year > MAX_YEAR)) {
            return res.status(400).json({ error: `year should be between ${MIN_YEAR} and ${MAX_YEAR}` });
        }

        // Validação dos itens
        if (items && (!Array.isArray(items) || items.length === 0)) {
            return res.status(400).json({ error: "At least one item is required" });
        }

        // Preparar dados atualizados
        const updatedData = {
            brand: brand || carExists.brand,
            model: model || carExists.model,
            year: year || carExists.year,
            items: items ? {
                deleteMany: {}, // Remove todos os itens antigos
                create: [...new Set(items.map(item => ({ name: item })))], // Remove duplicatas
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
