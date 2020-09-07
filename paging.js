// implements the relay cursor connection specification
// https://relay.dev/graphql/connections.htm

module.exports = {
  getPageResult: getPageResult 
}

function getPageResult(edges, before, after, first, last, orderByField, sort) {
  var edgesCursorsApplied = applyCursorsToEdges(edges, before, after, orderByField, sort);
  edges = edgesToReturn(edgesCursorsApplied, before, after, first, last, orderByField);

  const result = edges.map((book, index) => {
    return {
      node: book,
      cursor: orderByField === "author" ? `{"value":"${book.author}"}` : `{"value":"${book.title}"}`
    }
  });

  var pageInfo = {
    hasNextPage: hasNextPage(edgesCursorsApplied, before, after, first, last), 
    hasPreviousPage: hasPreviousPage(edgesCursorsApplied, before, after, first, last),
    startCursor: result[0].cursor,
    endCursor: result[result.length-1].cursor
  };

  return {
    pageInfo: pageInfo,
    edges: result
  };
}

function edgesToReturn(edges, before, after, first, last) {
  if (first != undefined) 
  {
    if (first < 0) {
      throw new Error("first cannot be less than 0");
    }

    if (edges.length > first) {
      edges = edges.slice(0, first);
    }
  }
  else if (last != undefined) {
    if (last < 0) {
      throw new Error("last cannot be less than 0");
    }

    if (edges.length > last) {
      edges = edges.slice(edges.length - last);
    }
  }
  return edges;
}

function applyCursorsToEdges(allEdges, before, after, orderByField, sort) {
  var edges = allEdges;
  if (after != undefined) {
    if (sort === "ASCENDING") {
      edges = allEdges.filter(book=>(book[orderByField] > after));
    }
    else {
      // if we are sorting descending need to reverse the comparison
      edges = allEdges.filter(book=>(book[orderByField] < after));
    }
  }
  else if (before != undefined) {
    if (sort === "ASCENDING") { 
      edges = allEdges.filter(book=>(book[orderByField] < before));
    }
    else {
      // if we are sorting descending need to reverse the comparison
      edges = allEdges.filter(book=>(book[orderByField] > before));
    }
  }
  return edges;
}

function hasPreviousPage(edges, before, after, first, last) {
  if (last != undefined) {
    return edges.length > last;
  }

  return false;
}

function hasNextPage(edges, before, after, first, last) {
  if (first != undefined) {
    return edges.length > first;
  }

  return false;
}