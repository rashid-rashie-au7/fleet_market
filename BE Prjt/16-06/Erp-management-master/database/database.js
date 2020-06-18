const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://localhost:27017/Grocery_Erp`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("ERROR : ", err.message);
  });
