import { graph as RDFLibStore } from 'rdflib';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import { loadDataFromDBIntoStore, PREFIXES, serialize } from './rdflib-helpers';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { ORGANISATION_GRAPH } from '../app';
import { parse as rdflibParse } from 'rdflib';

export async function getSearchQuery(uuid) {
  const store = new RDFLibStore();
  const options = {
    WHERE: `?s a searchToezicht:SearchQuery . ?s mu:uuid ${sparqlEscapeString(uuid)} .`
  };
  await loadDataFromDBIntoStore(store, options);
  return serialize(store);
}

export async function saveSearchQuery(ttl) {

  const unEscapedTriples = unescapeTTLTriples(ttl);

  if(!unEscapedTriples) return;

  await query(`
  INSERT DATA {
    GRAPH ${sparqlEscapeUri(ORGANISATION_GRAPH)} {
      ${unEscapedTriples}
    }
  }`);
}

export async function deleteSearchQuery(uuid) {
  const triples = await getSearchQuery(uuid);
  await deleteTriples(triples);
  return triples;
}

async function deleteTriples(triples) {

  const unEscapedTriples = unescapeTTLTriples(triples);

  if(!unEscapedTriples) return;

  await query(`
  ${PREFIXES.join('\n')}

  DELETE {
    GRAPH ?g {
      ${unEscapedTriples}
    }
  }
  WHERE {
    GRAPH ?g {
      ${unEscapedTriples}
    }
  }`
  );
}


function unescapeTTLTriples(ttl){
  // So n-triples charcacters may be escaped for special ones. E.g. \u0027
  // SPARQL expects 'decoded/unescaped' data. It won't interpret  \u0027. So we have to do the conversion ourselves
  const store = RDFLibStore();
  const graph = 'http://graph/for/escaping';
  rdflibParse(ttl, store, graph, 'text/turtle');

  //toNT returns the decoded string
  const statementsAsString = store.statements.map(x => x.toNT()).join('\n');

  return statementsAsString;
}

export async function updateSearchQuery(uuid, ttl) {
  await deleteSearchQuery(uuid);
  await saveSearchQuery(ttl);
}
