const { Client } = require('pg');

const app = require('epress')();
const cors = require('cors');
const multer = require('multer');

app.use(cors());

const client = new Client({
  user: 'postgres',
  password: 'admin',
  database: 'siloam',
});

client.connect().then(() => console.log('PostgreSQL Connected'));

app.get('/api/todoapp/GetNotes', async (request, response) => {
  const result = await client.query('SELECT * FROM todoapp');
  response.send(result.rows);
});

app.post('/api/todoapp/AddNotes', multer().none(), async (request, response) => {
  const { newNotes } = request.body;
  const result = await client.query('INSERT INTO todoapp (description) VALUES ($1)', [newNotes]);
  response.json('Added Successfully');
});

app.put('/api/todoapp/UpdateNotes', multer().none(), async (request, response) => {
  const { id, newNotes } = request.body;
  const result = await client.query('UPDATE todoapp SET description = $1 WHERE id = $2', [newNotes, id]);
  if (result.rowCount > 0) {
    response.json('Updated Successfully');
  } else {
    response.json('Failed to Update');
  }
});

app.delete('/api/todoapp/DeleteNotes', async (request, response) => {
  const { id } = request.query;
  const result = await client.query('DELETE FROM todoapp WHERE id = $1', [id]);
  response.json('Deleted Successfully');
});

app.listen(5038, () => console.log('Server started on port 5038'));