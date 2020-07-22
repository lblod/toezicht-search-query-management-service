import { graph as RDFLibStore } from 'rdflib';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import { loadDataFromDBIntoStore, PREFIXES, serialize } from './rdflib-helpers';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { ORGANISATION_GRAPH } from '../app';

export async function getSearchQuery(uuid) {
  const store = new RDFLibStore();
  const options = {
    WHERE: `?s a searchToezicht:SearchQuery . ?s mu:uuid ${sparqlEscapeString(uuid)} .`,
  };
  await loadDataFromDBIntoStore(store, options);
  return serialize(store);
}

export async function saveSearchQuery(ttl) {
  await query(`
INSERT DATA {
  GRAPH ${sparqlEscapeUri(ORGANISATION_GRAPH)} {
    ${ttl}
  }
}`);
}

export async function deleteSearchQuery(uuid) {
  const triples = await getSearchQuery(uuid);
  await deleteTriples(triples);
  return triples;
}

async function deleteTriples(triples) {
  await query(`
${PREFIXES.join('\n')}
DELETE {
  GRAPH ?g {
    ${triples}
  }
}
WHERE {
  GRAPH ?g {
    ${triples}
  }
}`);
}

export async function updateSearchQuery(uuid, ttl) {
  await deleteSearchQuery(uuid);
  await saveSearchQuery(ttl);
}

