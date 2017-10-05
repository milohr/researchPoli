"use strict";

const app = require('./app.js');
const server = app.listen(app.get('port'),startServer);

function startServer(err)
{
  if(err) return;
  console.log(`Started server on port: ${app.get('port')}`)
}
