import jwt from "jsonwebtoken";

const auth_user = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Login failed",
    });
  }

  try {
    // Decode the token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decodedToken.id; // Add user ID to the request body

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth_user;
