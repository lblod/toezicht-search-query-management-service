import {app, errorHandler} from 'mu';
import bodyParser from 'body-parser';
import {deleteSearchQuery, getSearchQuery, updateSearchQuery} from "./lib/search-qeury";
import {getFileContent} from "./lib/file-helpers";
import {getMetaData} from "./lib/enricher";

const FORMS = {
  'ebd65df9-5566-47c2-859a-ceff562881ab': 'share://search-query/config-form.ttl',
  'e025a601-b50b-4abd-a6de-d0c3b619795c': 'share://search-query/exe-form.ttl'
}

// ENV var.
export const BATCH_SIZE = parseInt(process.env.CONSTRUCT_BATCH_SIZE) || 1000;
export const ORGANISATION_GRAPH = process.env.ORGANIZATION_GRAPH || 'http://mu.semte.ch/graphs/organizations/141d9d6b-54af-4d17-b313-8d1c30bc3f5b';

app.use(bodyParser.text({
  type: function (req) {
    return /^text\/turtle/.test(req.get('content-type'));
  }
}));

app.get('/', function (req, res) {
  res.send('toezicht-search-query-management-service is healthy and working! :)');
});

app.get('/search-queries/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  try {
    const triples = await getSearchQuery(uuid);
    return res.status(200).set('content-type', 'text/turtle').send(triples);
  } catch (e) {
    console.log(`Something went wrong while retrieving triples for search-query with id ${uuid}`);
    console.log(e);
    return next(e);
  }
});

app.put('/search-queries/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  const ttl = req.body;
  try {
    await updateSearchQuery(uuid, ttl);
    return res.status(200).send();
  } catch (e) {
    console.log(`Something went wrong while updating triples for search-query with id ${uuid}`);
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

app.get('/search-query-forms/:uuid', async function (req, res, next) {
  const uuid = req.params.uuid;
  try {
    const form = await getFileContent(FORMS[uuid]);
    return res.status(200).set('content-type', 'text/turtle').send(form);
  } catch (e) {
    console.log(`Something went wrong while retrieving the form for id ${uuid}`);
    console.log(e);
    return next(e);
  }
});

app.get('/search-query-forms/:uuid/meta', async function (req, res, next) {
  try {
    const meta = await getMetaData();
    return res.status(200).set('content-type', 'text/turtle').send(meta);
  } catch (e) {
    console.log(`Something went wrong while building the meta data`);
    console.log(e);
    return next(e);
  }
});

app.use(errorHandler);