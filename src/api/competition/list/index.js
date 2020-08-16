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
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

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
              name: "Dom's Competition",
              startDate,
              endDate,
              cryptoType: "BTC",
              buyIn: 0.00055,
              prizePool: 0.457,
            },
            {
              name: "Ray's Competition",
              startDate,
              endDate,
              cryptoType: "BTC",
              buyIn: 0.00055,
              prizePool: 0.457,
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
