import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [livros, setLivros] = useState([]);
  const [estudantes, setEstudantes] = useState([]);
  const [isAddingLivro, setIsAddingLivro] = useState(false);
  const [isAddingEstudante, setIsAddingEstudante] = useState(false);
  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autor: '',
    ano: 0,
    editora: '',
  });
  const [novoEstudante, setNovoEstudante] = useState({
    matricula: '',
    nome_completo: '',
    data_nascimento: '',
    email: '',
    telefone: '',
  });

  const filtroLivrosPorStatus = (status) => livros.filter(livro => livro.status === status);

  function adicionarLivro() {
    setIsAddingLivro(true);
  }
  function adicionarEstudante() {
    setIsAddingEstudante(true);
  }

  const salvarLivro = async () => {
    try {
      await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoLivro, situacao: 'uso' }),
      });
      setIsAddingLivro(false);
      setNovoLivro({ modelo: '', cor: '', km: 0, placa: '' });
      buscarLivros();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    }
  };

  const salvarCliente = async () => {
    try {
      await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente),
      });
      setIsAddingCliente(false);
      setNovoCliente({ cpf: '', nome_completo: '', data_nascimento: '', email: '', telefone: '' });
      buscarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const buscarLivros = async () => {
    try {
      const response = await fetch('http://localhost:3000/livros');
      const data = await response.json();
      setLivros(data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  const buscarClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    buscarLivros();
    buscarEstudantes();
  }, []);

  return (
    <div>
      <header>
        <h1>Aluga Livro</h1>
        <button onClick={adicionarLivro}>Adicionar Livro</button>
        <button onClick={adicionarCliente}>Adicionar Cliente</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>Em Uso</h2>
          {filtroLivrosPorSituacao('uso').map(livro => (
            <Card key={livro.id} livro={livro} buscarLivros={buscarLivros} clientes={clientes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Alugados</h2>
          {filtroLivrosPorSituacao('alugado').map(livro => (
            <Card key={livro.id} livro={livro} buscarLivros={buscarLivros} clientes={clientes} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Em Manutenção</h2>
          {filtroLivrosPorSituacao('manutencao').map(livro => (
            <Card key={livro.id} livro={livro} buscarLivros={buscarLivros} clientes={clientes} />
          ))}
        </div>
      </div>
      {isAddingLivro && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Livro</h2>
            <input
              placeholder="Modelo"
              value={novoLivro.modelo}
              onChange={(e) => setNovoLivro({ ...novoLivro, modelo: e.target.value })}
            />
            <input
              placeholder="Cor"
              value={novoLivro.cor}
              onChange={(e) => setNovoLivro({ ...novoLivro, cor: e.target.value })}
            />
            <input
              type="number"
              placeholder="KM"
              value={novoLivro.km}
              onChange={(e) => setNovoLivro({ ...novoLivro, km: parseInt(e.target.value) })}
            />
            <input
              placeholder="Placa"
              value={novoLivro.placa}
              onChange={(e) => setNovoLivro({ ...novoLivro, placa: e.target.value })}
            />
            <button onClick={salvarLivro}>Salvar</button>
            <button onClick={() => setIsAddingLivro(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {isAddingCliente && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Cliente</h2>
            <input
              placeholder="CPF"
              value={novoCliente.cpf}
              onChange={(e) => setNovoCliente({ ...novoCliente, cpf: e.target.value })}
            />
            <input
              placeholder="Nome Completo"
              value={novoCliente.nome_completo}
              onChange={(e) => setNovoCliente({ ...novoCliente, nome_completo: e.target.value })}
            />
            <input
              type="date"
              placeholder="Data de Nascimento"
              value={novoCliente.data_nascimento}
              onChange={(e) => setNovoCliente({ ...novoCliente, data_nascimento: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoCliente.email}
              onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
            />
            <input
              placeholder="Telefone"
              value={novoCliente.telefone}
              onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
            />
            <button onClick={salvarCliente}>Salvar</button>
            <button onClick={() => setIsAddingCliente(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;