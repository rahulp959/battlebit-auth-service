import sentryHandler from '../../utils/sentryHandler'
import { getModel } from '../../models/User';

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://3333a73f1d6544b0926f10bd5835c690@sentry.io/5178520'
});

async function lambdaHandler(event) {
  const requestBody = JSON.parse(event.body);

  const User = await getModel()
  
  try {
    const userRecord = await User.create({ username: requestBody.username, password: requestBody.password });
    return {
      statusCode: 201,
      body: JSON.stringify({
        username: userRecord.username
      })
    }
  }
  catch {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create user'
      })
    }
  }
  
}

export const handler = sentryHandler(lambdaHandler)
