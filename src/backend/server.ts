import express = require('express');

const app = express();
app.use(express.static('./dist/frontend'));

app.listen(8080, () => {
  console.log('Listening on http://localhost:8080');
});