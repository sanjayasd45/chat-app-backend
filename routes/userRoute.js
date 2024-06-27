const express = require('express');
const { loginController, singupController, fetchAllUsersController, getSideUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const Router = express.Router()


Router.post("/login", loginController);
Router.post("/singup", singupController);
Router.post("/fetchUsers", fetchAllUsersController )
Router.post("/getSideChat", getSideUsers )


module.exports = Router