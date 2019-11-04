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
    reference[newItem.article_id] = newItem.title;
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
  newComments = renameKeys(newComments, "belongs_to", "article_id");
  return newComments.map(object => {
    object.article_id = articleRef[object.article_id];
    console.log(object.article_id);
    return { ...object };
  });
};

module.exports = { formatDates, makeRefObj, formatComments, renameKeys };
