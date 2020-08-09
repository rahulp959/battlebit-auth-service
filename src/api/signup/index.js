import sentryHandler from '../../utils/sentryHandler'
import { getModel } from '../../models/User';

// For some reason, Importing Sentry does not work at all. I'll figure it out another day
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://3333a73f1d6544b0926f10bd5835c690@sentry.io/5178520'
});

async function lambdaHandler(event, context) {
  // console.log(`EVENT: \n${  JSON.stringify(event, null, 2)}`)

  console.log(getModel)

  const User = await getModel()

  await User.create({ username: "Ray", password: "test" });

  return context.logStreamName
}

export const handler = sentryHandler(lambdaHandler)
