import { Sequelize } from 'sequelize';

let sequelize

export async function connectDb() {
  if(!sequelize) {
    sequelize = new Sequelize(process.env.DB_CONN_STRING)

    try {
      await sequelize.authenticate()
    }
    catch (error) {
      console.error('Unable to connect to the database: ', error)
    } 
  }

  return sequelize
}
