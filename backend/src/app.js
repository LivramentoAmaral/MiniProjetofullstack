// Importa as bibliotecas necessárias
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Usando a biblioteca 'uuid' para gerar identificadores únicos
const cors = require('cors'); // Habilita o middleware CORS para permitir requisições de diferentes origens

// Inicializa o aplicativo Express
const app = express();

// Configura middlewares
app.use(express.json()); // Permite que o aplicativo lide com solicitações JSON
app.use(cors({ origin: ['http://localhost:5173'] })); // Configura o CORS para permitir solicitações somente do domínio 'http://localhost:5173'

// Define o arquivo JSON usado para armazenar os agendamentos
const arquivoJson = 'src/db/agendamentos.json';
let agendamentos = [];

// Se o arquivo JSON existir, lê seu conteúdo e o analisa, caso contrário, cria um arquivo vazio
if (fs.existsSync(arquivoJson)) {
  const agendamentosRaw = fs.readFileSync(arquivoJson);
  agendamentos = JSON.parse(agendamentosRaw);
} else {
  fs.writeFileSync(arquivoJson, '[]');
}

// Define uma rota de raiz que simplesmente retorna uma mensagem
app.get('/', (req, res) => {
  res.status(200).send('Sistema de Agendamento');
});

// Define uma rota para listar todos os agendamentos
app.get('/agendamentos', (req, res) => {
  res.status(200).json(agendamentos);
});

// Define uma rota para criar um novo agendamento
app.post('/agendamentos', (req, res) => {
  const novoAgendamento = {
    id: uuidv4(), // Gera um ID único usando a biblioteca 'uuid'
    tipo: req.body.tipo,
    nome: req.body.nome,
    data: req.body.data,
    horaInicio: req.body.horaInicio,
    horaTermino: req.body.horaTermino,
    responsavel: req.body.responsavel
  };

  agendamentos.push(novoAgendamento); // Adiciona o novo agendamento ao array
  fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos)); // Salva o array atualizado no arquivo JSON
  res.status(201).json(novoAgendamento); // Retorna o novo agendamento criado com o status 201 (Criado)
});

// Define uma rota para buscar um agendamento pelo ID
app.get('/agendamentos/:id', (req, res) => {
  const agendamento = agendamentos.find(a => a.id === req.params.id);
  if (agendamento) {
    res.status(200).json(agendamento); // Retorna o agendamento encontrado com o status 200 (OK)
  } else {
    res.status(404).send('Agendamento não encontrado'); // Retorna um erro 404 se o agendamento não for encontrado
  }
});

// Define uma rota para excluir um agendamento pelo ID
app.delete('/agendamentos/:id', (req, res) => {
  const index = agendamentos.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    agendamentos.splice(index, 1); // Remove o agendamento do array
    fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos)); // Atualiza o arquivo JSON
    res.status(200).send(`Agendamento ${req.params.id} removido com sucesso`);
  } else {
    res.status(404).send('Agendamento não encontrado'); // Retorna um erro 404 se o agendamento não for encontrado
  }
});

// Define uma rota para atualizar um agendamento pelo ID
app.put('/agendamentos/:id', (req, res) => {
  const agendamento = agendamentos.find(a => a.id === req.params.id);
  if (agendamento) {
    // Atualiza as propriedades do agendamento com base nos dados da solicitação
    agendamento.tipo = req.body.tipo;
    agendamento.nome = req.body.nome;
    agendamento.data = req.body.data;
    agendamento.horaInicio = req.body.horaInicio;
    agendamento.horaTermino = req.body.horaTermino;
    agendamento.responsavel = req.body.responsavel;
    
    fs.writeFileSync(arquivoJson, JSON.stringify(agendamentos)); // Atualiza o arquivo JSON
    res.status(200).send('Agendamento alterado com sucesso');
  } else {
    res.status(404).send('Agendamento não encontrado'); // Retorna um erro 404 se o agendamento não for encontrado
  }
});

// Exporta o aplicativo Express para uso em outros lugares
module.exports = app;
