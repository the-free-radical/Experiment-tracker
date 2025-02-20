import Database from 'better-sqlite3'

//creating a better-sqlite3 database and opening
const db = new Database('Experiments.db');

db.exec(`CREATE TABLE IF NOT EXISTS mainTable (
    eId INTEGER PRIMARY KEY,
    experimentName TEXT,
    experimentAim TEXT,
    experimentBody TEXT,
    experimentConclusion TEXT)
`);

 db.exec(`CREATE TABLE IF NOT EXISTS relations (
    eId INTEGER,
    childNode INTEGER,
    FOREIGN KEY (eId) REFERENCES mainTable(eId))
`);

export function experimentFirstSave(modifiedInfo){
    try{
        const insert = db.prepare(`INSERT INTO mainTable (${modifiedInfo.modifiedField}) VALUES (?)`);
        const result = insert.run(modifiedInfo.modifiedFieldContent);
        if (result.changes > 0){
            return result.lastInsertRowid;
        }
    } catch(err){
        throw new Error(err)
    }
}

export function getExperimentDataById(eId){
    try{
        const experiment = db.prepare(`SELECT * FROM mainTable WHERE eID = ?`).get(eId);
        if(experiment!=null){
            return experiment;
        } else if(experiment==null){
            console.log('no such experiment');
            throw new Error('no such experiment');
        }
    } catch(err){
        throw new Error(err);
    }
}