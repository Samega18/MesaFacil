const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});