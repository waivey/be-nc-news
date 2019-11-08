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

const formatComments = (comments, articleRef) => {
  const newComments = comments.map(object => {
    const comment = { ...object };
    comment.author = comment.created_by;
    const updateComment = ({ created_by, ...rest }) => rest;
    const newComment = updateComment(comment);
    return newComment;
  });
  const updated = newComments.map(object => {
    object.article_id = articleRef[object.belongs_to];
    const updateObject = ({ belongs_to, ...rest }) => rest;
    const newObject = updateObject(object);
    return newObject;
  });
  const fullyFormated = formatDates(updated);

  return fullyFormated;
};

module.exports = { formatDates, makeRefObj, formatComments };
