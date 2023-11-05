const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'] }));

const arquivoJson = 'src/db/agendamentos.json';
let agendamentos = [];

if (fs.existsSync(arquivoJson)) {
  const agendamentosRaw = fs.readFileSync(arquivoJson);
  agendamentos = JSON.parse(agendamentosRaw);
} else {
  fs.writeFileSync(arquivoJson, '[]');
}

app.get('/', (req, res) => {
  res.status(200).send('Sistema de Agendamento');
});

app.get('/agendamentos', (req, res) => {
  res.status(200).json(agendamentos);
});

app.post('/agendamentos', (req, res) => {
  const novoAgendamento = {
    id: uuidv4(),
    tipo: req.body.tipo,
    nome: req.body.nome,
    data: req.body.data,
    horaInicio: req.body.horaInicio,
    horaTermino: req.body.horaTermino,
    responsavel: req.body.responsavel

  };

  agendamentos.push(novoAgendamento);
  fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos));
  res.status(201).json(novoAgendamento);
});

app.get('/agendamentos/:id', (req, res) => {
  const agendamento = agendamentos.find(a => a.id === req.params.id);
  if (agendamento) {
    res.status(200).json(agendamento);
  } else {
    res.status(404).send('Agendamento não encontrado');
  }
});

app.delete('/agendamentos/:id', (req, res) => {
  const index = agendamentos.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    agendamentos.splice(index, 1);
    fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos));
    res.status(200).send(`Agendamento ${req.params.id} removido com sucesso`);
  } else {
    res.status(404).send('Agendamento não encontrado');
  }
});

app.put('/agendamentos/:id', (req, res) => {
  const agendamento = agendamentos.find(a => a.id === req.params.id);
  if (agendamento) {
    agendamento.sala = req.body.sala;
    agendamento.data = req.body.data;
    agendamento.responsavel = req.body.responsavel;
    fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos));
    res.status(200).send('Agendamento alterado com sucesso');
  } else {
    res.status(404).send('Agendamento não encontrado');
  }
});

module.exports = app;
