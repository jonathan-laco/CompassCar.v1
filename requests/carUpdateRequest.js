const { updateCarSchema } = require("../validations/carValidation");

const validateUpdateCarRequest = (req, res, next) => {
  const { error } = updateCarSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message,
    }));
    return res.status(400).json({ status: "error", errors: errorMessages });
  }

  next();
};

module.exports = validateUpdateCarRequest;
