const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { PRIVATE_KEY } = process.env;

//token helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

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

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, PRIVATE_KEY);

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }
  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    //check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }

    const { name, email, phone, password, confirmpassword } = req.body;

    let image = "";

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    user.name = name
    
    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
 
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).send({ message: "Por favor, utilize outro email" });
      return;
    }

    user.email = email

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }

    user.phone = phone


    if (password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não conferem!" });
      return;
    }else if ( password === confirmpassword && password != null){
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      user.password = passwordHash
    }
    try {
       await User.findOneAndUpdate(
        {_id: user._id},
        {$set: user},
        {new: true}
      )
      res.status(200).json({ message: "Usuario atualizado com sucesso"})
      
    } catch (error) {
      res.status(500).json({ message: error})
      return
    }

  }
};
