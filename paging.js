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

// Trim down to just pull the number of edges that were specified for last for first
function edgesToReturn(edges, before, after, first, last) {
  // If first was specified
  if (first != undefined) 
  {
    if (first < 0) {
      throw new Error("first cannot be less than 0");
    }
    
    // If the length > first 
    if (edges.length > first) {
      // Slice out the first
      edges = edges.slice(0, first);
    }
  } // If last was specified
  else if (last != undefined) {
    if (last < 0) {
      throw new Error("last cannot be less than 0");
    }

    // If the length > last
    if (edges.length > last) {
      //  Slice out the last
      edges = edges.slice(edges.length - last);
    }
  }
  return edges;
}

// Filter results based on the cursor
function applyCursorsToEdges(allEdges, before, after, orderByField, sort) {
  var edges = allEdges;

  // If after was specified
  if (after != undefined) {
    if (sort === "ASCENDING") {
      // If we are sorting ascending find everything that is > the after cursor
      edges = allEdges.filter(book=>(book[orderByField] > after));
    }
    else {
      // If we are sorting descending need to find everything that < the after cursor
      edges = allEdges.filter(book=>(book[orderByField] < after));
    }
  } // If before was specified
  else if (before != undefined) {
    // If sorting ascending
    if (sort === "ASCENDING") { 
      // Find everything that is < the before cursor
      edges = allEdges.filter(book=>(book[orderByField] < before));
    } // If sorting descending
    else {   
      // Find everything that is > the before cursor
      edges = allEdges.filter(book=>(book[orderByField] > before));
    }
  }
  return edges;
}

function hasPreviousPage(edges, before, after, first, last) {
  if (last != undefined) {
    // If there are more edges than last then there is a previous page 
    return edges.length > last;
  }
  // Not easy to determine so just return false
  return false;
}

function hasNextPage(edges, before, after, first, last) {
  if (first != undefined) {
    // If there are more edges than first then there is a next page
    return edges.length > first;
  }
  // Not easy to determine so just return false
  return false;
}