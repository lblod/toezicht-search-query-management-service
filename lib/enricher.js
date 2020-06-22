import {sparqlEscapeUri} from 'mu';
import {graph as RDFLibStore} from 'rdflib';
import {addTriples, serialize} from "./rdflib-helpers";

/**
 * TODO add the following concept-schemes:
 * - Administrative Unit (Bestuurseenheid)
 * - Province
 */
const TOEZICHT_CONCEPT_SCHEMES = [
  'http://data.vlaanderen.be/id/conceptscheme/BestuurseenheidClassificatieCode', // Administrative Unit Classification
  'http://data.vlaanderen.be/id/conceptscheme/BestuursorgaanClassificatieCode', // Governing Body Classification
  'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5', // Decision Type
  'http://lblod.data.gift/concept-schemes/c93ccd41-aee7-488f-86d3-038de890d05a', // Regulation Type
  'http://lblod.data.gift/concept-schemes/b65b15ba-6755-4cd2-bd07-2c2cf3c0e4d3', // Chart of Account
];

export async function getMetaData(){
  const store =  RDFLibStore();
  await constructConceptSchemes(store);
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