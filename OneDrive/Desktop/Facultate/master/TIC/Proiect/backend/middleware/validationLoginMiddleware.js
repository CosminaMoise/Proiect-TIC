
const validateLogin = (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      error: "Missing ID token",
    });
  }

  next();
};

export default validateLogin;
