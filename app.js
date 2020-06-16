import {app, errorHandler} from 'mu';
import bodyParser from 'body-parser';
import {deleteSearchQuery, getSearchQuery, updateSearchQuery} from "./lib/search-qeury";

// ENV var.
export const BATCH_SIZE = parseInt(process.env.CONSTRUCT_BATCH_SIZE) || 1000;
export const ORGANISATION_GRAPH = process.env.ORGANIZATION_GRAPH || 'http://mu.semte.ch/graphs/organizations/141d9d6b-54af-4d17-b313-8d1c30bc3f5b';

app.use(bodyParser.text({ type: function(req) { return /^application\/n-triples/.test(req.get('content-type')); } }));

app.get('/', function (req, res) {
  res.send('toezicht-search-query-management-service is healthy and working! :)');
});

app.get('/search-queries/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  try {
    const triples = await getSearchQuery(uuid);
    return res.status(200).set('content-type', 'application/n-triples').send(triples);
  } catch (e) {
    console.log(`Something went wrong while retrieving triples for search-query with id ${uuid}`);
    console.log(e);
    return next(e);
  }
});

app.put('/search-queries/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  const triples = req.body;
  try {
    await updateSearchQuery(uuid, triples);
    return res.status(200).send();
  } catch (e) {
    console.log(`Something went wrong while deleting triples for search-query with id ${uuid}`);
    console.log(e);
    return next(e);
  }
});

app.delete('/search-queries/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  try {
    await deleteSearchQuery(uuid);
    return res.status(200).send();
  } catch (e) {
    console.log(`Something went wrong while deleting triples for search-query with id ${uuid}`);
    console.log(e);
    return next(e);
  }
});

app.use(errorHandler);