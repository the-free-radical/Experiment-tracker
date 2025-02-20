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

//sending experimentEdit.html (default experiment edit view)
app.get('/experiment/open', (req,res)=>{
    console.log(`openeing experiment no: ${req.query.eId}`)
    res.sendFile(path.join(publicPath, 'ExperimentEdit.html'))
})

//saving a newly created experiment for the first time and sending it
app.post('/experiment/new/firstSave', (req,res) => {
    try {
        console.log(`saving new experiment`)
        const eId = utils.experimentFirstSave(req.body);
        res.json({eId: eId})
    }catch(err) {
        res.status(500).json(err.message)
    }
})

//getting experiment data for a particular experiment
app.get('/experiment/getData', (req,res) =>{
    try{
        console.log(`getting data for experiment no: ${req.query.eId}`)
        const experimentData = utils.getExperimentDataById(req.query.eId);
        console.log(`sending data`);
        res.json(experimentData);
    }catch(err){
        res.status(500).json(err.message);
    }
})

app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`);
});