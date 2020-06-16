import {graph as RDFLibStore} from 'rdflib';
import {querySudo as query} from "@lblod/mu-auth-sudo";
import {addTriples, serialize} from "./rdflib-helpers";
import {sparqlEscapeUri, sparqlEscapeString} from 'mu';
import {ORGANISATION_GRAPH} from "../app";

const PREFIXES = [
  'PREFIX mu: <http://mu.semte.ch/vocabularies/core/>',
  'PREFIX searchToezicht: <http://lblod.data.gift/vocabularies/search-queries-toezicht/>'
]


export async function getSearchQuery(uuid) {
  const store = new RDFLibStore();
  const options = {
    PREFIXES,
    WHERE: `?s a searchToezicht:SearchQuery . ?s mu:uuid ${sparqlEscapeString(uuid)} .`
  }
  await addTriples(store, options);
  return serialize(store);
}

export async function updateSearchQuery(uuid, triples) {
  await deleteSearchQuery(uuid);
  await query(`
INSERT DATA {
  GRAPH ${sparqlEscapeUri(ORGANISATION_GRAPH)} {
    ${triples}
  }
}`);
}

export async function deleteSearchQuery(uuid) {
  await query(`
${PREFIXES.join('\n')}
DELETE {
  GRAPH ?g {
    ?s ?p ?o .
  }
}
WHERE {
  GRAPH ?g {
    ?s a searchToezicht:SearchQuery ; 
       mu:uuid ${sparqlEscapeString(uuid)} ;
       ?p ?o .
  }
}`);
}