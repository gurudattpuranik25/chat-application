const mongoose = require("mongoose");
// qju2XVqez9IwGP63 guruhp999
const uri =
  "mongodb+srv://guruhp999:qju2XVqez9IwGP63@cluster0.wwdec24.mongodb.net/backend-service?retryWrites=true&w=majority";


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
