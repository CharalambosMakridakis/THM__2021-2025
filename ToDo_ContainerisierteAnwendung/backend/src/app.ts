import express, { Request, Response }  from 'express';
import cors from 'cors';
import * as mysql from 'mysql';
import fs from 'fs';

interface resInterface {
  meta: {
      from: string,
      avg: string
  },
  table: tableEntry[]
}

interface tableEntry {
  index: string,
  moduleName: string,
  crp: number, 
  grade: number, 
  weight: number
}

const app = express();
const port = 3000;
app.use(express.json());

const allowedOrigins = ['http://localhost:8000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: 'POST',
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(options));

const dbUser = fs.readFileSync(process.env.DB_USER_FILE as string, 'utf-8').trim();
const dbPassword = fs.readFileSync(process.env.DB_PASSWORD_FILE as string, 'utf-8').trim();
const dbDatabase = fs.readFileSync(process.env.DB_DATABASE_FILE as string, 'utf-8').trim();



const dbConfig: mysql.ConnectionConfig = {
  host: 'maria-db',
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
};

let connection: mysql.Connection;

const connectToDatabase = async (attempt = 1, maxAttempts = 5): Promise<void> => {
  try {
    connection = await mysql.createConnection(dbConfig);

    const connectPromise = () => new Promise<void>((resolve, reject) => {
      connection.connect((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await connectPromise();

    console.log('Erfolgreich mit der Datenbank verbunden');
  } catch (error) {
    console.error("Verbindung zur Datenbank fehlgeschlagen.");
    console.error(`Versuch ${attempt}/${maxAttempts}`);

    if (attempt < maxAttempts) {
      setTimeout(() => connectToDatabase(attempt + 1, maxAttempts), 10000);
    } else {
      console.error(`Maximale Anzahl von Versuchen (${maxAttempts}) erreicht. Aufgabe abgebrochen.`);
    }
  }
};

connectToDatabase();


app.post('/api/save', (req: Request<{ data: resInterface }>, res: Response) => {
  let name: string = req.body.data.meta.from;
  let avg: number = req.body.data.meta.avg;
  let table: tableEntry[] = req.body.data.table;

  
  try {
    
    let sqlQuery = `DELETE FROM grade WHERE grade_owner = "${name}"`;
    
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Fehler bei der Abfrage:', err);
        return;
      }
    });
    
    if(table.length < 1) return;

    sqlQuery = "INSERT INTO grade (modulename, grade, crp, grade_weight, grade_index, grade_owner) VALUES ";

    table.forEach(entry => {
      sqlQuery += `("${entry.moduleName}", ${entry.grade}, ${entry.crp}, ${entry.weight}, "${entry.index}", "${name}" ),`
    });

    sqlQuery = sqlQuery.substring(0, sqlQuery.length - 1);
    sqlQuery += ';';

    console.log(sqlQuery);

    connection.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Fehler bei der Abfrage:', err);
        return;
      }
    });

    res.json({
      status: "success"
    });

  } catch (error) {
    res.json({
      status: "error"
    });
  }
});

app.post('/api/load', async (req: Request<{ name: string }>, res: Response) => {
  let name = req.body.name;
  let data: resInterface = {
    meta: {
    from: name,
    avg: "0"
    },
    table: [
    ]
  }
  
  try {

    const sqlQuery = `SELECT * FROM grade WHERE grade_owner = "${name}"`;

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Fehler bei der Abfrage:', err);
        return;
      }
      
      results.forEach((row: any) => {
        data.table.push({
          index: row.grade_index,
          moduleName: row.modulename,
          crp: row.crp,
          grade: row.grade,
          weight: row.grade_weight
        })
      })

      res.json(data);
    });


  } catch (error) {
    res.json({
      status: "error"
    });
  }

});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


