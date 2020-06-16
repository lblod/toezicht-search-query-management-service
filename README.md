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

Prefix | URI 
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

### Email

Once the errors have been picked up by this service, we will create an new email about it.
