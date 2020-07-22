# toezicht-search-query-management-service

Service that provides management of search-queries.

## Installation

To add the service to your stack, add the following snippet to docker-compose.yml:

```
services:
  search-query-managment:
    image: lblod/toezicht-search-query-management-service:x.x.x
    volumes:
      - ./config/search-query:/share/search-query
```

## Configuration

### Environment variables

- `META_CONSTRUCTION_CRON_PATTERN`: Frequency at witch the meta-data should be re-constructed. Defaults to 0 0 */2 * * *, run every 2 hours.
- `ORGANISATION_GRAPH` : Graph where the new data/triples will be put on PUT. Default implemented.
- `BATCH_SIZE` : Max number of triples it will retrieve on construction of a search-query. Default set to 1000.

   
## REST API

### GET `/search-query/:uuid`

Retrieves all the triples for the search-query with the given UUID.

- Content-Type: `application/n-triples`

### PUT `/search-query/:uuid`

Replaces the old triples with the received triples for the search-query with the given UUID.

- Accepts: `application/n-triples`
- Content-Type: `application/n-triples`

### DELETE `/search-query/:uuid`

Deletes all the data/triples for the search-query with the given UUID.

### GET `/search-query-forms/:uuid`

Retrieves the content of the form for the given UUID.

- Content-Type: `text/turtle`

### POST `search-query-forms/initiate-meta-construction`

re-Constructs the meta-data of the forms.

### GET `/search-query-forms/:uuid/meta`

Retrieves the meta-data of the form for the given UUID.

- Accepts: `application/n-triples`
- Content-Type: `application/n-triples`

## Model

### Used prefixes

Prefix | URI 
--- | --- 
searchToezicht: |  <http://lblod.data.gift/vocabularies/search-queries-toezicht/>
skos: |  <http://www.w3.org/2004/02/skos/core#>
mu: |  <http://mu.semte.ch/vocabularies/core/>

### Search Query

Encapsulated a preset of search qeuries/filters.

#### Class

`ext:SearchQuery`

#### Properties

 Name | Predicate | Range | Definition 
--- | --- | --- | ---
uuid | `mu:uuid` | `xsd:string` | Unique identifier
label | `skos:prefLabel` | `xsd:string` | Name of the SearchQuery
comment | `skos:comment` | `xsd:string` | More detailed description of the SearchQeury

TODO add all the supported filters.

## Development

For a more detailed look in how to develop a microservices based on the [mu-javascript-template](https://github.com/mu-semtech/mu-javascript-template), 
we would recommend reading "[Developing with the template](https://github.com/mu-semtech/mu-javascript-template#developing-with-the-template)"

### Developing in the `mu.semte.ch` stack

Paste the following snip-it in your `docker-compose.override.yml`:

````  
search-query-managment:
  image: semtech/mu-javascript-template:1.4.0
  ports:
    - 8888:80
    - 9229:9229
  environment:
    NODE_ENV: "development"
  volumes:
    - ./config/search-query:/share/search-query
    - /absolute/path/to/your/sources/:/app/
