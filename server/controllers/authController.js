export const verifyToken = async (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: { id: req.user.id, email: req.user.email },
  });
};
