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
    console.log(`opening experiment no: ${req.query.eId}`)
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

app.post('/experiment/saveData', (req, res) => {
    try{
        console.log("--------------------------------");
        console.log(`saving data for experiment ${req.query.eId}`);
        const modifiedInfo = req.body;
        const saveStatus = utils.saveExperimentDataById(req.query.eId, modifiedInfo);
        console.log("--------------------------------");
        res.json(saveStatus);
    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }
})

app.post('/experiment/search', (req, res) => {
    try{
        const search = req.body;
        console.log(search)
        const matches = utils.searchExperiment(search.field, search.content);
        console.log(matches)
        res.json(matches);
    }catch(err){
        res.status(500).json(err);
    }
})

app.post('/relatedExperiment/createFollowUp', (req, res) => {
    const followUpExperimentInfo = req.body;
    try{
        const eIdFollowUpExperiment = utils.experimentFirstSave(followUpExperimentInfo);
        console.log(`created follow up experiment with title ${req.body.modifiedFieldContent}`);
        const followUpLinkCreation = utils.addChildNodeLink(req.query.eId, eIdFollowUpExperiment);
        res.json({eId: eIdFollowUpExperiment, message: followUpLinkCreation})
    } catch(err){
        console.error(err);
        res.status(500).json(err)
    }
})

app.post('/relatedExperiment/getFollowUp', (req,res) => {
    const requestInfo = req.body;
    let followUpList = [];
    try{
        console.log('getting followUp experiments for experiment ', requestInfo.eId )
        const followUpInfo = utils.getChildNodes(requestInfo.eId)
        console.log(followUpInfo)
        if(followUpInfo!= null){
            followUpInfo.forEach(followUp => {
                const experimentInfo = utils.getExperimentDataById(followUp.childNode);
                followUpList.push({eId: experimentInfo.eId, experimentName: experimentInfo.experimentName});
            });
            res.json(followUpList);
        }else if(followUpInfo==null)
            res.json(null)
    }catch(err){
        res.status(500).json(err)
    }
})

app.post('/relatedExperiment/getReferences', (req,res) => {
    let referenceList = [];
    try{
        console.log('getting referenced experiments for experiment', req.body.eId);
        const references = utils.getReferences(req.body.eId)
        if(references!=null){
            references.forEach(reference => {
                const experimentInfo = utils.getExperimentDataById(reference.eId)
                referenceList.push({eId: experimentInfo.eId, experimentName: experimentInfo.experimentName});
            })
            res.json(referenceList);
        }else if(references==null)
            res.json(null)
    } catch(err){
        res.status(500).json(err)
    }
})

app.get('/relatedExperiment/addReference', (req,res) => {
    const followUpLinkCreation = utils.addChildNodeLink(req.query.referenceId, req.query.eId);
    res.json({message: followUpLinkCreation})
})


app.get('/tableOfContents', (req,res)=>{
    res.sendFile(path.join(publicPath, 'TableOfContents.html'))
})

app.get('/tableOfContents/getMaxCount', (req,res) => {
    const maxCount = utils.getMaxCount();
    res.json(maxCount)
})

app.get('/tableOfContents/getExperimentsInPage', (req,res) => {
    const lowerBound = req.query.lowerBound
    const upperBound = req.query.upperBound
    const experiments = utils.getExperimentsInRange(lowerBound,upperBound)
    res.json(experiments)
})



app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`);
});