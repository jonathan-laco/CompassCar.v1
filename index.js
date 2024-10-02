const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importar as rotas
const createCar = require('./routes/createCar');
const deleteCar = require('./routes/deleteCar');
const getCar = require('./routes/getCar');
const listCars = require('./routes/listCars');
const updateCar = require('./routes/updateCar');

// Usar as rotas
app.use('/api/v1/cars', createCar);
app.use('/api/v1/cars', deleteCar);
app.use('/api/v1/cars', getCar);
app.use('/api/v1/cars', listCars);
app.use('/api/v1/cars', updateCar);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
