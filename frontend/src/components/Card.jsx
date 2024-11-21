import React, { useState } from 'react';

function Card({ livro, buscarLivros }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...livro });
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [emprestimoData, setEmprestimoData] = useState({
    matricula_estudante: '',
    data_retirada: '',
    data_prevista_entrega: ''
  });

  const alterarSituacao = async (novaSituacao) => {
    if (novaSituacao === 'alugado') {
      setIsEmprestimolModalOpen(true);
    } else {
      await atualizarLivro(novaSituacao);
    }
  };

  const atualizarLivro = async (novaSituacao, dadosEmprestimo = null) => {
    const body = { ...livro, situacao: novaSituacao };
    if (dadosEmprestimo) {
      body.cpf_estudante = dadosEmprestimo.cpf_estudante;
      body.data_retirada = dadosEmprestimo.data_retirada;
      body.data_prevista_entrega = dadosEmprestimo.data_prevista_entrega;
    }
    await fetch(`http://localhost:3000/livros/${livro.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    buscarLivros();
  };

  const salvarEmprestimo = async () => {
    await atualizarLivro('alugado', emprestimoData);
    setIsEmprestimoModalOpen(false);
    setEmprestimoData({ cpf_estudante: '', data_retirada: '', data_prevista_entrega: '' });
  };

  const editarLivro = async () => {
    await fetch(`http://localhost:3000/livros/${livro.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCar)
    });
    buscarLivros();
    setIsEditing(false);
  };

  const deletarLivro = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja deletar este livro?");
    if (confirmed) {
      await fetch(`http://localhost:3000/livros/${livro.id}`, { method: 'DELETE' });
      buscarLivros();
    }
  };

  return (
    <div className="card">
      <h3>{livro.modelo}</h3>
      <p>Cor: {livro.cor}</p>
      <p>KM: {livro.km}</p>
      <p>Placa: {livro.placa}</p>
      <p>Situação: {livro.situacao}</p>
      {livro.situacao === 'uso' && (
        <>
          <button onClick={() => alterarSituacao('alugado')}>Alugar</button>
          <button onClick={() => alterarSituacao('manutencao')}>Manutenção</button>
        </>
      )}
      {livro.situacao === 'alugado' && (
        <button onClick={() => alterarSituacao('uso')}>Indisponível</button>
      )}
      {livro.situacao === 'manutencao' && (
        <button onClick={() => alterarSituacao('uso')}>Finalizar Manutenção</button>
      )}
      {isEditing && (
        <div>
          <input
            value={editedCar.modelo}
            onChange={(e) => setEditedCar({ ...editedCar, modelo: e.target.value })}
          />
          <input
            value={editedCar.cor}
            onChange={(e) => setEditedCar({ ...editedCar, cor: e.target.value })}
          />
          <input
            type="number"
            value={editedCar.km}
            onChange={(e) => setEditedCar({ ...editedCar, km: parseInt(e.target.value) })}
          />
          <input
            value={editedCar.placa}
            onChange={(e) => setEditedCar({ ...editedCar, placa: e.target.value })}
          />
          <button onClick={editarLivro}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}
      {!isEditing && (
        <>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <button onClick={deletarLivro}>Deletar</button>
        </>
      )}
      {isEmprestimoModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Emprestimo</h2>
            <input
              placeholder="CPF do Estudante"
              value={emprestimoData.cpf_estudante}
              onChange={(e) => setEmprestimoData({ ...emprestimoData, cpf_estudante: e.target.value })}
            />
            <input
              type="date"
              value={emprestimoData.data_retirada}
              onChange={(e) => setEmprestimoData({ ...emprestimoData, data_retirada: e.target.value })}
            />
            <input
              type="date"
              value={emprestimoData.data_prevista_entrega}
              onChange={(e) => setEmprestimoData({ ...emprestimoData, data_prevista_entrega: e.target.value })}
            />
            <button onClick={salvarEmprestimo}>Confirmar Emprestimo</button>
            <button onClick={() => setIsEmprestimoModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;


