import jwt from "jsonwebtoken";

const TokenGenerate = (UserId) => {
  const accessToken = jwt.sign({ UserId }, process.env.JWT_SEC, {
    expiresIn: "30d",
  });

  return accessToken;
};

export { TokenGenerate };
