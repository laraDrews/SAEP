const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'biblioteca', // Nome da sua database
    password: 'senai', // Substitua pela sua senha
    port: 5432, // Porta padrão do PostgreSQL
});

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota para buscar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM livros');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});

// Rota para buscar um carro por ID
app.get('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM livros WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar carro' });
    }
});

// Rota para adicionar um carro
app.post('/livros', async (req, res) => {
    const { titulo, autor, ano, editora, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO livros (titulo, autor, ano, editora, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [titulo, autor, ano, editora, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar carro' });
    }
});

app.put('/livros/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, ano, editora, status, cpf_cliente, data_retirada, data_prevista_entrega } = req.body;
    try {
      // Atualizar o carro
      const updateResult = await pool.query(
        'UPDATE livros SET titulo = $1, autor = $2, ano = $3, editora = $4, status = $5 WHERE id = $6 RETURNING *',
        [titulo, autor, ano, editora, status, id]
      );
  
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
  
      // Criar aluguel se situação for "alugado"
      if (status === 'emprestado') {
        await pool.query(
          'INSERT INTO emprestimos (codigo_livro, matricula_estudante, data_retirada, data_prevista_entrega) VALUES ($1, $2, $3, $4)',
          [id, matricula_estudante, data_retirada, data_prevista_entrega]
        );
      }
      
      // Atualizar devolução se situação for "uso" (devolvido)
      if (status === 'disponivel') {
        await pool.query(
          'UPDATE emprestimos SET devolucao = true WHERE codigo_livro = $1 AND devolucao = false',
          [id]
        );
      }
  
      res.json(updateResult.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao atualizar livro e registrar aluguel/devolução' });
    }
  });

// Rota para deletar um carro
app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM livros WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.json({ message: 'Carro deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar carro' });
    }
});

// Rota para adicionar um cliente
app.post('/estudantes', async (req, res) => {
    const { cpf, nome_completo, data_nascimento, email, telefone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO estudantes (cpf, nome_completo, data_nascimento, email, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [cpf, nome_completo, data_nascimento, email, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar estudantes' });
    }
});

// Rota para buscar todos os estudantes
app.get('/estudantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudantes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar estudantes' });
    }
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
