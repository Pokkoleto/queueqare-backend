import { sign } from "jsonwebtoken";
import config from "../config/config";

const NAMESPACE = "Auth";

const signJWT = (
  user,
  callback: (error: Error | null, token: string | null) => void
): void => {
  var timeSinceEpoch = new Date().getTime();
  var expirationTime =
    timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  try {
    sign(
      {
        username: user.username,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (error) {
    callback(error, null);
  }
};

export default signJWT;
