# toezicht-search-query-management-service

TODO

## Installation

To add the service to your stack, add the following snippet to docker-compose.yml:

```
services:
  search-qeury-managment:
    image: lblod/toezicht-search-query-management-service:x.x.x
```

## Configuration

TODO

### Environment variables

   
## REST API

### GET `/search-qeury/:uuid`

TODO

## Model

TODO

### Used prefixes

Prefix | URI ### Email

Once the errors have been picked up by this service, we will create an new email about it.
--- | --- 
ext: |  <http://mu.semte.ch/vocabularies/ext/>

### Search Query

TODO

#### Class

`ext:SearchQuery`

#### Properties

 Name | Predicate | Range | Definition 
--- | --- | --- | ---
label | `rdfs:label` | `xsd:string` | Label of he error

## Development

For a more detailed look in how to develop a microservices based on the [mu-javascript-template](https://github.com/mu-semtech/mu-javascript-template), 
we would recommend reading "[Developing with the template](https://github.com/mu-semtech/mu-javascript-template#developing-with-the-template)"

### Developing in the `mu.semte.ch` stack

Paste the following snip-it in your `docker-compose.override.yml`:

````  
search-qeury-managment:
  image: semtech/mu-javascript-template:1.4.0
  ports:
    - 8888:80
  environment:
    NODE_ENV: "development"
  volumes:
    - /absolute/path/to/your/sources/:/app/
