import {querySudo as query} from "@lblod/mu-auth-sudo";

export async function waitForDatabase(maxi = 10) {
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
    await query(`SELECT DISTINCT ?Concept WHERE {[] a ?Concept} LIMIT 100`);
    return true;
  } catch (e) {
    return false;
  }
}