const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', (req,res) =>{
    res.sendFile(path.join(publicPath, 'TempHome.html'));
});

app.get('/experiment/new', (req,res)=>{
    res.sendFile(path.join(publicPath, 'ExperimentEdit.html'))
})

app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`);
});