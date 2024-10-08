import express from 'express';

const app = express();

const port = 42069;

app.get('/', (req, res) => {
    res.sendFile('test.html', { root: './public' })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})