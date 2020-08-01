const errorHandler = (error, req, res, next) => {
  return res
    .status(error.status || 500)
    .send({
      status: 'Error',
      message: error.message
    });
};

module.exports = errorHandler;
