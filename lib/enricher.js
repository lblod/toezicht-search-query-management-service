import {sparqlEscapeUri} from 'mu';
import {graph as RDFLibStore, st} from 'rdflib';
import {addTriples, DEFAULT_GRAPH, serialize, SKOS} from "./rdflib-helpers";

/**
 * TODO add the following concept-schemes:
 * - Administrative Unit (Bestuurseenheid)
 */

const CHART_OF_ACCOUNTS = 'http://lblod.data.gift/concept-schemes/b65b15ba-6755-4cd2-bd07-2c2cf3c0e4d3';

const TOEZICHT_CONCEPT_SCHEMES = [
  'http://data.vlaanderen.be/id/conceptscheme/BestuurseenheidClassificatieCode', // Administrative Unit Classification
  'http://data.vlaanderen.be/id/conceptscheme/BestuursorgaanClassificatieCode', // Governing Body Classification
  'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5', // Decision Type
  'http://lblod.data.gift/concept-schemes/c93ccd41-aee7-488f-86d3-038de890d05a', // Regulation Type
  CHART_OF_ACCOUNTS,
  'http://lblod.data.gift/concept-schemes/372797ff-917c-4572-925f-f09cc30932e6' // Province
];

export async function getMetaData() {
  const store = RDFLibStore();
  await constructConceptSchemes(store);
  await enrichChartOfAccounts(store);
  return serialize(store, {contentType: "application/n-triples"});
}

async function constructConceptSchemes(store) {
  for (let conceptScheme of TOEZICHT_CONCEPT_SCHEMES) {
    console.log(`Adding concept scheme ${conceptScheme} to meta data`);
    await addTriples(store, {
      WHERE: `?s skos:inScheme ${sparqlEscapeUri(conceptScheme)} .`
    });
  }
}

async function enrichChartOfAccounts(store) {
  const charts = store
    .match(undefined, SKOS('inScheme'), store.sym(CHART_OF_ACCOUNTS), store.sym(DEFAULT_GRAPH))
    .map(t => t.subject );
  for(const chart of charts) {
    const label = store.any(chart, SKOS('prefLabel'), undefined, store.sym(DEFAULT_GRAPH)).value;
    const notation = store.any(chart, SKOS('notation'), undefined, store.sym(DEFAULT_GRAPH)).value;

    store.remove(st(chart, SKOS('prefLabel'), undefined, store.sym(DEFAULT_GRAPH)));
    store.add(chart, SKOS('prefLabel'), `MAR${notation} - ${label}`, store.sym(DEFAULT_GRAPH));
  }
}