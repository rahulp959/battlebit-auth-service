import { compare } from 'bcrypt'
import sentryHandler from '../../utils/sentryHandler'
import { getModel } from '../../models/User';
import generateToken from '../../utils/generateToken';

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN
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
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        user: {
          username: userRecord.username,
          email: userRecord.email,
          bybitRegistration: userRecord.bybitRegistration,
          referralCode: userRecord.referralCode
        },
        token: generateToken(userRecord)
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
