import { MONGO_URI } from '../config';
// import { MONGO_URI } from '../config';
const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default dbConnection;