import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const apiURL = 'http://localhost:8000';
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [novoAgendamento, setNovoAgendamento] = useState({
    tipo: '',
    nome: '',
    data: '',
    horaInicio: '',
    horaTermino: '',
    responsavel: '',
  });
  const [erro, setErro] = useState(null);

  const AdicionarAgendamento = async () => {
    try {
      if (agendamentoSelecionado) {
        // Atualizar o agendamento existente
        await axios.put(`${apiURL}/agendamentos/${agendamentoSelecionado.id}`, novoAgendamento);
      } else {
        // Criar um novo agendamento
        await axios.post(`${apiURL}/agendamentos`, novoAgendamento);
      }
      setAgendamentoSelecionado(null);
      setNovoAgendamento({
        tipo: '',
        nome: '',
        data: '',
        horaInicio: '',
        horaTermino: '',
        responsavel: '',
      });
      buscarAgendamentos();
      setErro('');
    } catch (error) {
      setErro(`Erro ao adicionar agendamento: ${error.message}`);
    }
  }

  const CancelarAtualizacao = () => {
    setAgendamentoSelecionado(null);
    setNovoAgendamento({
      tipo: '',
      nome: '',
      data: '',
      horaInicio: '',
      horaTermino: '',
      responsavel: '',
    });
  }

  const EditarAgendamento = agendamento => {
    setAgendamentoSelecionado(agendamento);
    setNovoAgendamento({
      tipo: agendamento.tipo,
      nome: agendamento.nome,
      data: agendamento.data,
      horaInicio: agendamento.horaInicio,
      horaTermino: agendamento.horaTermino,
      responsavel: agendamento.responsavel,
    });
  }

  const buscarAgendamentos = async () => {
    try {
      const response = await axios.get(`${apiURL}/agendamentos`);
      setAgendamentos(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao buscar agendamentos: ' + error.message);
    }
  }

  const RemoverAgendamento = async id => {
    try {
      await axios.delete(`${apiURL}/agendamentos/${id}`);
      buscarAgendamentos();
      setErro('');
    } catch (error) {
      setErro(`Erro ao remover agendamento: ${error.message}`);
    }
  }

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  return (
    <div className="container">

      <div className='containerinterno'>
        <div className='tabela'>
          <h2>Gerenciamento de Laboratórios e Salas de Reuniões </h2>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Hora de Início</th>
                <th>Hora de Término</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            {erro && <p className="error">{erro}</p>}

            <tbody>

              {agendamentos.map(agendamento => (
                <tr key={agendamento.id}>
                  <td> {agendamento.tipo}</td>
                  <td> {agendamento.nome}</td>
                  <td> {agendamento.data}</td>
                  <td> {agendamento.horaInicio}</td>
                  <td> {agendamento.horaTermino}</td>
                  <td> {agendamento.responsavel}</td>
                  <td>
                    <button
                      className="editButton"
                      onClick={() => EditarAgendamento(agendamento)}
                    >
                      Editar
                    </button>
                    <button
                      className="removeButton"
                      onClick={() => RemoverAgendamento(agendamento.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="containerForm">
          <h2>Adicionar/Atualizar Agendamento</h2>
          <div className="form">
            <label>Tipo: </label>
            <input
              type="text"
              value={novoAgendamento.tipo}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, tipo: e.target.value })
              }
            />
            <label>Nome Sala/Laboratório: </label>
            <input
              type="text"
              value={novoAgendamento.nome}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, nome: e.target.value })
              }
            />
            <label>Data: </label>
            <input
              type="date"
              value={novoAgendamento.data}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, data: e.target.value })
              }
            />
            <label>Hora de Início: </label>
            <input
              type="time"
              value={novoAgendamento.horaInicio}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, horaInicio: e.target.value })
              }
            />
            <label>Hora de Término: </label>
            <input
              type="time"
              value={novoAgendamento.horaTermino}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, horaTermino: e.target.value })
              }
            />
            <label>Responsável: </label>
            <input
              type="text"
              value={novoAgendamento.responsavel}
              onChange={e =>
                setNovoAgendamento({ ...novoAgendamento, responsavel: e.target.value })
              }
            />
            <button className="addButton" onClick={AdicionarAgendamento}>
              {agendamentoSelecionado ? 'Atualizar' : 'Adicionar'}
            </button>
            <button className="cancelButton" onClick={CancelarAtualizacao}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
