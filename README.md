# EDirectInsure Project

This service is responsible to manage project crud operations

### Patterns

```
role: project, cmd: create
role: project, cmd: select
role: project, cmd: update
role: project, cmd: delete
```

### Installing

```bash
$ npm i
```

### Package Dependency

- [seneca](https://github.com/senecajs/seneca)
- [lodash](https://github.com/lodash/lodash)
- [mongo-client](https://github.com/amorimdev/edirectinsure-mongo-client)

### Environment Variables

```
PROJECT_HOST # project service host
PROJECT_PORT # project service port

MONGO_URL # url from mongo server
```

### Tests


```sh
$ npm test
```

Run tests with Node debugger:

```bash
$ npm run test-debugger
```
