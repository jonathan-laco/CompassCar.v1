const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint para excluir carro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const carExists = await prisma.car.findUnique({
            where: { id: parseInt(id) },
        });

        if (!carExists) {
            return res.status(404).json({ error: 'Car not found' });
        }

        await prisma.car.delete({ where: { id: parseInt(id) } });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error deleting car' });
    }
});

module.exports = router;
