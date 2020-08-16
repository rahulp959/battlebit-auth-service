import { hash } from "bcrypt";
import sentryHandler from "../../../utils/sentryHandler";
import { getModel } from "../../../models/User";
import generateToken from "../../../utils/generateToken";

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

async function lambdaHandler(event) {
  const requestBody = JSON.parse(event.body);

  const User = await getModel();

  try {
    const hashedPassword = await hash(requestBody?.password, 10);
    const userRecord = await User.create({
      username: requestBody?.username,
      password: hashedPassword,
      email: requestBody?.email,
      bybitRegistration: requestBody?.bybitRegistration,
      referralCode: requestBody?.referralCode,
    });
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        user: {
          username: userRecord.username,
          email: userRecord.email,
          bybitRegistration: userRecord.bybitRegistration,
          referralCode: userRecord.referralCode,
        },
        token: generateToken(userRecord),
      }),
    };
  } catch (ex) {
    console.error(ex);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create user",
      }),
    };
  }
}

export const handler = sentryHandler(lambdaHandler);
