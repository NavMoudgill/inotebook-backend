const handleValidationError = (errors, status) => {
  const newErrors = errors.map((element) => {
    const obj = { field: element.path, message: element.msg };
    return obj;
  });
  return {
    newErrors,
    statusCode: status,
    success: false,
  };
};
const handleInternalServerError = (status) => {
  return {
    message: "Sorry, Internal server error occurred",
    statusCode: status,
    success: false,
  };
};
const handleEmailError = (status) => {
  return {
    message: "Sorry, this email already exists",
    statusCode: status,
    success: false,
  };
};
const handleUnauthorizedError = (status) => {
  return {
    message: "Put right credentials",
    statusCode: status,
    success: false,
  };
};
module.exports = {
  handleValidationError,
  handleInternalServerError,
  handleEmailError,
  handleUnauthorizedError,
};
