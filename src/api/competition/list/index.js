import sentryHandler from "../../../utils/sentryHandler";
// import { getModel } from "../../models/User";

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

async function lambdaHandler() {
  // const requestHeaders = JSON.parse(event.headers);

  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify([
        {
          competitions: [
            {
              name: "",
              startDate: "",
              endDate: "",
              cryptoType: "",
              buyIn: "",
              prizePool: "",
            },
          ],
        },
      ]),
    };
  } catch (ex) {
    console.error(ex);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to sign in",
      }),
    };
  }
}

export const handler = sentryHandler(lambdaHandler);
