const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.wwdec24.mongodb.net/backend-service?retryWrites=true&w=majority`;

module.exports.mongodb = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch {
    console.log("Database connection failed!");
  }
};
