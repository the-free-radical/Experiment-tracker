import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as utils from './core.mjs';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicPath));

app.get('/', (req,res) =>{
    res.sendFile(path.join(publicPath, 'TempHome.html'));
});

app.get('/experiment/new', (req,res)=>{
    res.sendFile(path.join(publicPath, 'ExperimentEdit.html'))
})

app.post('/experiment/new/firstSave', (req,res) => {
    try {
        const eId = utils.experimentFirstSave(req.body);
        res.json({eId: eId})
    }catch(err) {
        res.status(500).json(err.message)
    }
})

app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`);
});