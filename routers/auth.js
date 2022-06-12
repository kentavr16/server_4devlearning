import { Router } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../helpers/config.js";
var router = Router();
import { createUser, checkUser, AuthCheck } from "../helpers/connection.js";
import User from "../models/UserModel.js";

router.post("/register", checkUser, (req, res) => {
  createUser(req)
    .then((resp) => res.send(resp))
    .catch((err) => {
      //залогировать ошибки сервера?
      res
        .status(500)
        .send({
          message: "Щось сталося не так як гадалося... Помилка серверу.",
        });
    });
});

router.post("/signin", async function (req, res) {
  let candidateLogin = req.body.login;
  let candidatePassword = req.body.password;
  let user = await User.findOne({ login: candidateLogin });
  if (!user) {
    res
      .status(404)
      .send({
        message:
          "Користувач не знайдений. Перевірте правильність паролю та логіну.",
      });
    return;
  }
  if (user.password === candidatePassword) {
    const token = jwt.sign({ userID: user.id }, secret, {
      expiresIn: "1h",
    });
    res.send({ token: token });
  }
});

router.get("/cabinet", AuthCheck, async (req, res) => {
  let currentUserID = req.user.userID;
  let currentUser = await User.findById(currentUserID);
  if (currentUser) {
    res.send({message:currentUser});
  }
  if(!currentUser){
    res.status(403).send({message:"access restricted"})
    console.log("error");
  }
});

export default router;
