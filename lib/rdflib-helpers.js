import {querySudo as query} from "@lblod/mu-auth-sudo";
import {sparqlEscapeUri, sparqlEscapeString} from 'mu';
import {parse as rdflibParse, serialize as rdflibSerialize, sym} from 'rdflib';
import {BATCH_SIZE} from "../app";

export const DEFAULT_GRAPH = 'http://lblod.data.gift/services/toezicht-search-query-management-service/';

export function serialize(store) {
  return rdflibSerialize(sym(DEFAULT_GRAPH), store, undefined, 'application/n-triples');
}

export async function addTriples(store, {PREFIXES, WHERE}) {
  const count = await countTriples({PREFIXES, WHERE});
  if (count > 0) {
    console.log(`Parsing 0/${count} triples`);
    let offset = 0;
    const query = `
      ${PREFIXES.join('\n')}
      
      SELECT ?s ?p ?o
      WHERE {
        GRAPH ?g {
          ${WHERE}
          ?s ?p ?o .
        }
      }
      LIMIT ${BATCH_SIZE} OFFSET %OFFSET
    `;

    while (offset < count) {
      await parseBatch(store, query, offset);
      offset = offset + BATCH_SIZE;
      console.log(`Parsed ${offset < count ? offset : count}/${count} triples`);
    }
  }
}

async function parseBatch(store, q, offset = 0, limit = 1000) {
  const pagedQuery = q.replace('%OFFSET', offset);
  const result = await query(pagedQuery);

  if (result.results.bindings.length) {
    const ttl = result.results.bindings.map(b => selectResultToNT(b['s'], b['p'], b['o'])).join('\n');
    rdflibParse(ttl, store, DEFAULT_GRAPH, 'text/turtle');
  }
}

function selectResultToNT(s, p, o) {
  const subject = sparqlEscapeUri(s.value);
  const predicate = sparqlEscapeUri(p.value);
  let obj;
  if (o.type === 'uri') {
    obj = sparqlEscapeUri(o.value);
  } else {
    obj = `${sparqlEscapeString(o.value)}`;
    if (o.datatype)
      obj += `^^${sparqlEscapeUri(o.datatype)}`;
  }
  return `${subject} ${predicate} ${obj} .`;
}

async function countTriples({PREFIXES, WHERE}) {
  const queryResult = await query(`
      ${PREFIXES.join('\n')}
      
      SELECT (COUNT(*) as ?count)
      WHERE {
        GRAPH ?g {
          ${WHERE}
          ?s ?p ?o .
        }
      }
    `);

  return parseInt(queryResult.results.bindings[0].count.value);
}
