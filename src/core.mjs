import Database from 'better-sqlite3'

//creating a better-sqlite3 database and opening
const db = new Database('Experiments.db');

db.exec(`CREATE TABLE IF NOT EXISTS mainTable (
    eId INTEGER PRIMARY KEY,
    name TEXT,
    aim TEXT,
    body TEXT,
    conclusion TEXT)
`);

 db.exec(`CREATE TABLE IF NOT EXISTS relations (
    eId INTEGER,
    childNode INTEGER,
    FOREIGN KEY (eId) REFERENCES mainTable(eId))
`);

