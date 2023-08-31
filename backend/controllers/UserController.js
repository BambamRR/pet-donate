const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: "A senha e confirmação devem ser iguais" });
      return;
    }

    //Check if user exists

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "Por favor utilize outro email " });
      return;
    }
    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = bcrypt.hashSync(password, salt);

    //create  a user

    const user = {
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    };

    try {
      const newUSer = await User.create(user);

      await createUserToken(newUSer, req, res);

      // res.status(201).json({ message: 'Usuário Criado', newUSer})
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "Email ou senha incorretos" });
      return;
    }

    //check if passwords match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Email ou senha incorretos" });
      return;
    }

    await createUserToken(user, req, res)

  }
};
