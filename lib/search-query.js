import { graph as RDFLibStore } from 'rdflib';
import { querySudo as query } from '@lblod/mu-auth-sudo';
import { loadDataFromDBIntoStore, PREFIXES, serialize } from './rdflib-helpers';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { ORGANISATION_GRAPH } from '../app';
import { parse as rdflibParse } from 'rdflib';

export async function getSearchQuery(uuid) {
  const store = new RDFLibStore();
  const options = {
    WHERE: `?s a searchToezicht:SearchQuery . ?s mu:uuid ${sparqlEscapeString(uuid)} .`,
  };
  await loadDataFromDBIntoStore(store, options);
  return serialize(store);
}

export async function saveSearchQuery(ttl) {

  const chunks = unescapedTTLChunks(ttl);

  if (!chunks.length) return;

  for (let ttl of chunks) {
    await query(`
INSERT DATA {
  GRAPH ${sparqlEscapeUri(ORGANISATION_GRAPH)} {
    ${ttl}
  }
}`);
  }
}

export async function deleteSearchQuery(uuid) {
  const triples = await getSearchQuery(uuid);
  await deleteTriples(triples);
  return triples;
}

async function deleteTriples(triples) {

  const chunks = unescapedTTLChunks(triples);

  if (!chunks.length) return;

  for (let ttl of chunks) {
    await query(`
${PREFIXES.join('\n')}

DELETE {
  GRAPH ?g {
    ${ttl}
  }
}
WHERE {
  GRAPH ?g {
    ${ttl}
  }
}`);
  }
}

function unescapedTTLChunks(ttl) {
  // So n-triples charcacters may be escaped for special ones. E.g. \u0027
  // SPARQL expects 'decoded/unescaped' data. It won't interpret  \u0027. So we have to do the conversion ourselves
  const store = RDFLibStore();
  const graph = 'http://graph/for/escaping';
  rdflibParse(ttl, store, graph, 'text/turtle');

  const chunk = 20;
  const statements = store.statements;

  let chunks = [];
  for (let i = 0; i < statements.length; i += chunk) {
    //toNT returns the decoded string
    chunks.push(statements.slice(i, i + chunk).map(x => x.toNT()).join('\n'));
  }

  return chunks;
}

export async function updateSearchQuery(uuid, ttl) {
  await deleteSearchQuery(uuid);
  await saveSearchQuery(ttl);
}
