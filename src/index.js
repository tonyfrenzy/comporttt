import app from './server.js';
import dbConnection from './database/dbconn.js';
const port = process.env.PORT || 7000;

dbConnection.getConnect();

app.listen(port, () => {
  console.log(`Server connected at  http://localhost:${port}`);
});
