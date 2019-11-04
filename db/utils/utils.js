exports.formatDates = list => {
  return list.map(item => {
    let newItem = { ...item };
    let dateVal = newItem.created_at;
    let newDate = new Date(dateVal);

    newItem.created_at = newDate;

    return { ...newItem };
  });
};

exports.makeRefObj = list => {
  const reference = {};
  list.forEach(item => {
    let newItem = { ...item };
    reference[newItem.article_id] = newItem.title;
  });
  return reference;
};

exports.formatComments = (comments, articleRef) => {};
