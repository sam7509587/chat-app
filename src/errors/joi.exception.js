const { ejsPages, ejsData } = require('../constants');

const JoiException = async (schema, req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    const errorMsg = result.error.details[0].message.replace(
      /[^a-zA-Z0-9 ]/g,
      '',
    );
    ejsData.err = errorMsg;
    return res.render(ejsPages.LOGIN, ejsData);
  } next();
};

module.exports = { JoiException };
