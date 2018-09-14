//importar modulos
var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');

router.get('/', controllers.HomeController.index);

//rutas de usuario

//crea la ruta para la pagina host:puerto/auth/signup (se necesit la funcion getSignUp creada previamente en UserController.js)
router.get('/auth/signup', controllers.UserController.getSignUp);
//llama a la funcion que envía la funcion postSignUp que envia al servido los datos registrados (se necesit la funcion postSignUp creada previamente en UserController.js)
router.post('/auth/signup', controllers.UserController.postSignUp);
//crea la ruta para la pagina host:puerto/auth/signin (se necesit la funcion getSignIn creada previamente en UserController.js)
router.get('/auth/signin', controllers.UserController.getSignIn);
router.post('/auth/signin', passport.authenticate('local', {
  successRedirect : '/users/panel',
  failureRedirect : '/auth/signin',
  failureFlash : true
}));

router.get('/auth/logout', controllers.UserController.logout);
module.exports = router;

//a todas las paginas que estén protegidas con inicio de sesion hay que agregarle el middleware (AuthMiddleware.isLogged)
//esto sirve para que cuando no estén logueados no los deje accede a esa direccion

router.get('/users/panel', AuthMiddleware.isLogged, controllers.UserController.getUserPanel);
