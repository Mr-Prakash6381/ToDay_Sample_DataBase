const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(express.json());
const PORT = 3007;
app.listen(PORT, () => {
  console.log("Server is runing : ", PORT);
});
mongoose
  .connect(process.env.DataBase_URL)
  .then(() => {
    console.log("MongoDB Connected ... ");
  })
  .catch((err) => {
    console.log("MongoDB Connect Error :", err);
  });
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model("User", userSchema);
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ Message: "Hellow World This project is ToDay_Sample_DataBase)" });
});
app.post("/users", async (req, res) => {
  const { name, age, city, email } = req.body;
  const user = new User({ name, age, city, email });
  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ Message: "User not Stored :", error });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ Message: "User Not Found :", error });
  }
}); 
app.get('/users/:id',async(req,res)=>{
  try{
  const findUser=await User.findById(req.params.id)
  console.log(findUser)
  res.status(200).json(findUser)
  }
  catch(error){
    res.status(400).json({Message:"User not found please check enter id",error})
  }
})
app.put('/users/:id', async (req, res) => {
  try {
    const updatedDocument = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
        email: req.body.email
      },
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ Message: "Document not found" });
    }
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(400).json({ Message: "Invalid ID or update details" });
  }
});

app.delete('/users/:id',async(req,res)=>{
  try{
  const findUserId=await User.findByIdAndDelete(req.params.id)
  res.status(200).json(findUserId)
  }
  catch(error){
    res.status(400).json({Message : "user not delete please cehck again"})
  }
})
