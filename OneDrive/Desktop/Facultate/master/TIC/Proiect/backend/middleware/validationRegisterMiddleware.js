const validateRegistration = (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      error:
        "Missing required fields: email, password, and fullName are required",
    });
  }

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  if (fullName.trim().length < 2) {
    return res.status(400).json({
      error: "Full name must be at least 2 characters long",
    });
  }

  next();
};

export default validateRegistration;