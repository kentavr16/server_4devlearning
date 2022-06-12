import pkg from "mongoose";
const { connect } = pkg;
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { secret } from "../helpers/config.js";

const uri =
  "mongodb+srv://Viktor:AdGjMpTw1990@cluster0.kiio1.mongodb.net/devDB";
async function connection(uri) {
  await connect(uri, () => {
    console.log("connected");
  });
}



async function createUser(req, res) {
  let candidateLogin = req.body.login;
  let candidatePassword = req.body.password;
  const newUser = new User({
    login: candidateLogin,
    password: candidatePassword,
    createDate: new Date().toLocaleDateString(),
  });
  await newUser.save();
  return {message:"Користувач успішно створений!"};
}

async function checkUser(req, res, next) {
  let candidateLogin = req.body.login;
  let candidatePassword = req.body.password;
if(!candidateLogin || !candidatePassword){
  return res.status(400).send({message:"Поля з логіном та паролем мусять бути заповнені!"})
}
  let candidate = await User.findOne({login:candidateLogin})
  if(candidate){
   return  res.status(400).send({message:"Схоже,цей логін вже використовується."})

  }
  let test = /^[0-9A-Za-z]{4,10}$/gi;
  if (test.test(candidateLogin) === false||test.test(candidatePassword===false)) {
    res
      .status(400)
      .send({
        message:"Логін і пароль мусять містити тільки латинські літери і цифри та складатися з 4-10 символів."
      });
    return;
  }
  next();
}

function AuthCheck(req, res, next) {
  if(!req.headers.authorization){
    res.status(403)
  }
  const headerAuth = req.headers.authorization;
  const token = headerAuth.split(" ")[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403);
    }
    //write to request object parameter "user" and go on
    req.user = user;
    next();
  });
}

export { uri, connection, createUser, checkUser, AuthCheck };
