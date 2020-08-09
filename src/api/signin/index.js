import { compare } from 'bcrypt'
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
    const userRecord = await User.findOne({
      where: {
        username: requestBody?.username
      }
    });

    if(!userRecord) {
      throw new Error('User not found: ', requestBody.username)
    }
    
    const correctPassword = await compare(requestBody?.password, userRecord.password);

    if(!correctPassword) {
      throw new Error('Incorrect Password: ', requestBody.username)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          username: userRecord.username
        },
        token: 'nope'
      })
    }
  }
  catch(ex) {
    console.error(ex)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to sign in'
      })
    }
  }
  
}

export const handler = sentryHandler(lambdaHandler)
