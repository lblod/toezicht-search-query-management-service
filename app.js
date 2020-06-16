import {app, errorHandler} from 'mu';

app.get('/', function (req, res) {
  res.send('toezicht-search-query-management-service is healthy and working hard! :)');
});

app.use(errorHandler);