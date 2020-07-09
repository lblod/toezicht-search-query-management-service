import {MU_SPARQL_ENDPOINT} from "../app";

const rp = require('request-promise');

export async function waitForDatabase(maxi = 5) {
  let attempts = 0;
  let up = await isDatabaseUp();
  while (!up && (attempts < maxi )) {
    console.log("Waiting for database to wake-up ...");
    up = await isDatabaseUp();
    await new Promise(r => setTimeout(r, 2000));
    attempts++
  }
  if(!up) {
    throw new Error('Failed to connect to the db, are you sure it is running?');
  }
}

async function isDatabaseUp() {
  try {
    await rp(MU_SPARQL_ENDPOINT);
    return true;
  } catch (e) {
    return false;
  }
}