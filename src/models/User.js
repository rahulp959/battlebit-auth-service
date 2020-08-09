import { DataTypes } from 'sequelize'
import { connectDb } from '../utils/db'

let model

export async function getModel() {
  const sequelize = await connectDb()

  if(!model) {
    model = sequelize.define('User', {
      // Model attributes are defined here
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // Other model options go here
    });


    await model.sync()
  }

  return model
}

