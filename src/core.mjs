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

db.function('REGEXP', { deterministic: true }, (regex, string) => {
    try {
      const re = new RegExp(regex); // Create a JavaScript RegExp object
      return re.test(string) ? 1 : 0; // Return 1 for match, 0 for no match
    } catch (e) {
      // Handle invalid regex patterns (important!)
      console.error("Invalid regex:", regex, e);
      return 0; // Or throw an error if you prefer
    }
  });

export function experimentFirstSave(modifiedInfo){
    try{
        console.log(modifiedInfo)
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

//saves info to database when new data is added to any editable field of the experiment
export function saveExperimentDataById(eId, modifiedInfo){
    try {
        let fieldsChanged = [];
        modifiedInfo.forEach(row => {
            const update = db.prepare(`UPDATE mainTable SET ${row.modifiedField} = ? WHERE eId = ?`);
            const result = update.run(row.modifiedFieldContent, eId);
            if (result.changes > 0){
                console.log(`'${row.modifiedField}' set to '${row.modifiedFieldContent}'`)
                fieldsChanged.push(`${row.modifiedField}' set to '${row.modifiedFieldContent}`)
            }
        })
    return {message: fieldsChanged}
    } catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export function addChildNodeLink(eId, childEId){
    try{
        const addChild = db.prepare(`INSERT INTO relations (eId, childNode) VALUES (?,?)`)
        const result = addChild.run(eId, childEId);
        if(result.changes >0){
            return `added as a follow up to exp no: ${eId}`
        }
    } catch(err){
        throw new Error(err)
    }
}

export function getChildNodes(eId){
    try{   
        const select = db.prepare(`SELECT * FROM relations WHERE eId = ?`);
        const followUp = select.all(eId)
        if(followUp!=null){
            return followUp
        }else{
            return null;
        }   
    }catch(err){
        throw new Error(err)
    }  
}

export function getReferences(eId){
    try{const select = db.prepare(`SELECT * FROM relations WHERE childNode = ?`);
        const reference = select.all(eId)
        if(reference!=null){
            return reference;
        }else{
            return null;
        }   
    }catch(err){
        throw new Error(err)
    }  
}

export function searchExperiment(column, string){
    try{
        console.log(column, string)
        const search = db.prepare(`SELECT * FROM mainTable WHERE ${column} REGEXP ?`);
        const results = search.all(string)
        if(results!=null){
            console.log(results)
            return results;
        }else{
            console.log('no results')
            return null;
        }
    } catch(err){
        throw new Error(err)
    }
}

export function getMaxCount(){
    try{
        const select = db.prepare(`SELECT eId FROM mainTable ORDER BY eId DESC LIMIT 1`)
        const count = select.get();
        console.log(count)
        return count
    } catch(err){
        throw new Error(err)
    }
}

export function getExperimentsInRange(lowerBound, upperBound){
    try{
        const select = db.prepare(`SELECT eId, experimentName FROM mainTable WHERE eId < ? AND eId > ?`)
        const results =  select.all(upperBound,lowerBound)
        console.log(results);
        return results;
    } catch(err){
        throw new Error(err)
    }
}