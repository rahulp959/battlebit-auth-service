import { DataTypes } from 'sequelize'
import { connectDb } from '../utils/db'

let model

export async function getModel() {
  const sequelize = await connectDb()

  if(!model) {
    model = sequelize.define('User', {
      // Model attributes are defined here
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bybitRegistration: {
        type: DataTypes.STRING,
        allowNull: false
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // Other model options go here
    });


    await model.sync({ alter: true })
  }

  return model
}

