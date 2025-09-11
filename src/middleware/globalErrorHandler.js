function globalErrorHandler(error, req, res, next) {
  const { statusCode = 500, message } = error;

  console.error("Error:", error);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
    },
  });
}

export default globalErrorHandler;
