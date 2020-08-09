import { hash } from 'bcrypt'
import sentryHandler from '../../utils/sentryHandler'
import { getModel } from '../../models/User';

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

async function lambdaHandler(event) {
  const requestBody = JSON.parse(event.body);

  const User = await getModel()
  
  try {
    const hashedPassword = await hash(requestBody?.password, 10)
    const userRecord = await User.create({ username: requestBody?.username, password: hashedPassword });
    return {
      statusCode: 201,
      body: JSON.stringify({
        username: userRecord.username
      })
    }
  }
  catch(ex) {
    console.error(ex)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create user'
      })
    }
  }
  
}

export const handler = sentryHandler(lambdaHandler)
