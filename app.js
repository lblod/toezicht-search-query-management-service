import {app, errorHandler} from 'mu';
import {deleteSearchQuery, getSearchQuery, updateSearchQuery} from "./lib/search-qeury";

app.get('/', function (req, res) {
  res.send('toezicht-search-query-management-service is healthy and working hard! :)');
});

/**
 * Get SearchQuery data for the given uuid
 *
 * @return triple data
 */
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
  // TODO figure out how to extract these
  const triples = null;
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