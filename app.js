

require('dotenv').config();
const serverless = require('serverless-http');
const app = require('./server');

const PORT = process.env.PORT || 3006;

app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

module.exports.handler = serverless(app);
