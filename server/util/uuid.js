const uuid = (prefix) => prefix + "_" + (new Date()).getTime();

module.exports = uuid;
