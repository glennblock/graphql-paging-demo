# Overview
This demo illustates how to implement the [GraphQL Cursor Connections](https://relay.dev/graphql/connections.htm) specification in your Apollo GraphQL endpoint in order to support paging.

# Disclaimer
This is purely for educational purposes. The app is not secure, the data store is in memory, and the approach used here won't scale. The concepts here can easily be adapted to a real world system. 

# Installing
- Clone the repo. 
- Run `npm install` (or use yarn) in the folder. 

# Running
- `npm start`
- After the server is running open "http://localhost:4000"
- The graphiql editor will open. 

# Walkthrough

## Query 1 - Retrieving the first set of results
Issue the following query to retrieve the first page
```
{
  books( 
    first:3,
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        author
        description
      }
      cursor
    }
  }
}
```
Running the query will return the first 3 books

![query_1](https://user-images.githubusercontent.com/141124/92407693-26ae5d00-f0f0-11ea-8358-6b5697b84406.png)

## Query 2 - Getting the next page
To get the next page of results, pass the `endCursor` value `{\"value\":\"Git Pocket Guide\"}` as the `after` param in the query.
```
{
  books( 
    first:3,
    after: "{\"value\":\"Git Pocket Guide\"}"
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        author
        description
      }
      cursor
    }
  }
}
```
![query_2](https://user-images.githubusercontent.com/141124/92407796-78ef7e00-f0f0-11ea-8792-2e6bd05218ea.png)

## Query 3 - Getting the previous page
To go back a page, pass the `startCursor` value `{\"value\":\"Learning JavaScript Design Patterns\"}` as the `before` param in the query, then set `last` to 3
```
{
  books( 
    last:3,
    before: "{\"value\":\"Learning JavaScript Design Patterns\"}"
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        author
        description
      }
      cursor
    }
  }
}
```
![query_3](https://user-images.githubusercontent.com/141124/92408227-ad176e80-f0f1-11ea-9dea-7f27b70a1d24.png)

## Query 4 - Sorting
You can also sort data and use cursors while sorting. The following query will sort by `AUTHOR` descending and find authors after me.
```
{
  books( 
    first:3,
    after: "{\"value\":\"Glenn Block, et al.\"}",
    orderBy: AUTHOR
    sort: DESCENDING
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        author
        description
      }
      cursor
    }
  }
}
```



