import { sign } from 'jsonwebtoken'

export default function generateToken(user) {
  const data =  {
    id: user.id,
    username: user.name,
  };
  const signature = process.env.TOKEN_SIGNATURE;
  const expiration = process.env.TOKEN_LIFETIME;

  return sign({ data, }, signature, { expiresIn: expiration });
}
