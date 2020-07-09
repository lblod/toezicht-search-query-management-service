import {MU_SPARQL_ENDPOINT} from "../app";

const rp = require('request-promise');

export async function waitForDatabase(maxi = 5) {
  let attempts = 0;
  let up = isDatabaseUp();
  while (!up && (attempts <= maxi )) {
    console.log("Waiting for database to wake-up ...");
    up = isDatabaseUp();
    await new Promise(r => setTimeout(r, 2000));
    attempts++
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