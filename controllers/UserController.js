var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = {

	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},
//envia al servidor los datos puestos en las casillas del registro
	postSignUp: function(req, res, next){
        //crea una variable salt que es la que da el nivel de encriptacion
        var salt = bcrypt.genSaltSync(11);
        //(encripta la contraseña)crea una variable password a la cual le pasa lo que recibe req.body.password que es la contraseña que se digita y el salt que es el nivel de encriptado
        var password = bcrypt.hashSync(req.body.password, salt);
        //(objeto user)  guarda en cada variable lo que quenvia req.body
        var user = {
        	email : req.body.email,
        	nombre : req.body. nombre,
        	documento: req.body.doc,
        	password : password
        };
        //variable config a la cual se le pasa la configuracion de la base de datos
        var config = require('.././database/config');
        //crea una conexion a la base de datos, necesario cada vez que se haga una consulta
        var db = mysql.createConnection(config);

        //ahora conectarse a la base de datos 
        db.connect();

        //crear la consulta
        db.query('INSERT INTO users SET ?', user, function(err, rows, field){
           //err contienen los errores que se produzcan así que si se produce un error entra al if
            if(err) throw err;
            
            //cierra la base de datos (hacer cada vez que haya una consulta)
            db.end();
        });
        
        req.flash('info', 'Se ha registrado satisfactoriamente')
        //redireccionar el usuario una vez que se registre
        return res.redirect('/auth/signin');
	},

	//crear un metodo para inicio de sesion que nos devuelve el formulario 

	getSignIn : function(req, res, next){
		return res.render('users/signin', {message: req.flash('info'), authmessage : req.flash('authmessage')});
	},

    logout : function(req, res, next){
        req.logout();
        res.redirect('/auth/signin');
    },

    getUserPanel : function(req, res, next){
            res.render('users/panel', {
            isAuthenticated : req.isAuthenticated(),
            user : req.user
        });
    }
};