const formatDates = list => {
  return list.map(item => {
    let newItem = { ...item };
    let dateVal = newItem.created_at;
    let newDate = new Date(dateVal);

    newItem.created_at = newDate;

    return { ...newItem };
  });
};

const makeRefObj = list => {
  const reference = {};
  list.forEach(item => {
    let newItem = { ...item };
    reference[newItem.title] = newItem.article_id;
  });
  return reference;
};

const renameKeys = (arr, keyToChange, newKey) => {
  return arr.map(object => {
    const newObj = { ...object };
    const value = newObj[keyToChange];
    newObj[newKey] = value;
    delete newObj[keyToChange];
    return { ...newObj };
  });
};

const formatComments = (comments, articleRef) => {
  let newComments = renameKeys(comments, "created_by", "author");
  const updated = newComments.map(object => {
    object.article_id = articleRef[object.belongs_to];

    delete object.belongs_to;
    return { ...object };
  });
  const fullyFormated = formatDates(updated);

  return fullyFormated;
};

module.exports = { formatDates, makeRefObj, formatComments, renameKeys };
