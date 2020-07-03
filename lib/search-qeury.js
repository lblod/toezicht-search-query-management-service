import {graph as RDFLibStore} from 'rdflib';
import {querySudo as query} from "@lblod/mu-auth-sudo";
import {addTriples, parse, PREFIXES, serialize} from "./rdflib-helpers";
import {sparqlEscapeUri, sparqlEscapeString} from 'mu';
import {ORGANISATION_GRAPH} from "../app";

export async function getSearchQuery(uuid) {
  const store = new RDFLibStore();
  const options = {
    WHERE: `?s a searchToezicht:SearchQuery . ?s mu:uuid ${sparqlEscapeString(uuid)} .`
  }
  await addTriples(store, options);
  return serialize(store, {contentType: 'application/n-triples'});
}

export async function updateSearchQuery(uuid, ttl) {
  const store = new RDFLibStore();
  await deleteSearchQuery(uuid);
  parse(ttl, store);

  await query(`
INSERT DATA {
  GRAPH ${sparqlEscapeUri(ORGANISATION_GRAPH)} {
    ${serialize(store, {contentType: 'application/n-triples'})}
  }
}`);
}

export async function deleteSearchQuery(uuid) {
  const triples = await getSearchQuery(uuid);
  await deleteTriples(triples);
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