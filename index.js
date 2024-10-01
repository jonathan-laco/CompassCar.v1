const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importar as rotas
const carRoutes = require('./routes/cars');
app.use('/api/v1/cars', carRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
