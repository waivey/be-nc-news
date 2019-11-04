exports.formatDates = list => {
  return list.map(item => {
    let newItem = { ...item };
    let dateVal = newItem.created_at;
    let newDate = new Date(dateVal);

    newItem.created_at = newDate.toString();

    return { ...newItem };
  });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
