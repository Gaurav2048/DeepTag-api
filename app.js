const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

require('./routes/Posts')(app);
require('./routes/User')(app);
require('./routes/Likes')(app);
require('./routes/Impression')(app);
require('./routes/Profile')(app);

mongoose.connect(
  'mongodb://localhost:27017/DeepTags',
  { useNewUrlParser: true, useUnifiedTopology: true, createIndexes: true },
  () => console.log('connected ')
);

app.listen(3000);
