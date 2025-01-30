const validateBookCreate = (req, res, next) => {
  const {
    title,
    author,
    publisher,
    publishYear,
    publishLocation,
    description,
  } = req.body;

  if (
    !title ||
    !author ||
    !publisher ||
    !publishYear ||
    !publishLocation ||
    !description
  ) {
    return res.status(400).json({
      success: false,
      error: "All fields are required except image",
    });
  }

  const currentYear = new Date().getFullYear();
  if (publishYear < 1000 || publishYear > currentYear) {
    return res.status(400).json({
      success: false,
      error: "Invalid publication year",
    });
  }

  if (description.length < 10) {
    return res.status(400).json({
      success: false,
      error: "Description should be at least 10 characters long",
    });
  }

  if (!Number.isInteger(Number(publishYear))) {
    return res.status(400).json({
      success: false,
      error: "Publication year must be a valid number",
    });
  }
  next();
};

export const validateBookUpdate = (req, res, next) => {
  const {
    title,
    author,
    publisher,
    publishYear,
    publishLocation,
    description,
  } = req.body;

  if (
    !title &&
    !author &&
    !publisher &&
    !publishYear &&
    !publishLocation &&
    !description &&
    req.body.imageUrl === undefined
  ) {
    return res.status(400).json({
      success: false,
      error: "At least one field must be provided for update",
    });
  }

  if (publishYear) {
    const currentYear = new Date().getFullYear();
    if (publishYear < 1000 || publishYear > currentYear) {
      return res.status(400).json({
        success: false,
        error: "Invalid publication year",
      });
    }

    if (!Number.isInteger(Number(publishYear))) {
      return res.status(400).json({
        success: false,
        error: "Publication year must be a valid number",
      });
    }
  }

  if (description && description.length < 10) {
    return res.status(400).json({
      success: false,
      error: "Description should be at least 10 characters long",
    });
  }

  next();
};

export default validateBookCreate;
