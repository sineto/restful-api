const errorHandler = (error, req, res, next) => {
  if (typeof error === 'string') {
    return res
      .status(error.status || 500)
      .send({
        type: 'Error',
        message: error.message
      });
  }
};

module.exports = errorHandler;
