//llama los modulos que necesitas
var LocalStartegy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
    	done(null, user);
    });

    passport.deserializeUser(function(obj, done){
        done(null, obj);
    });

//funcion para inicio de sesion
    passport.use(new LocalStartegy({
       passReqToCallback : true
    }, function(req, email, password, done){
     //configurar base de datos para la peticion
     var config = require('.././database/config');
     //se conecta con la base de datos
     var db = mysql.createConnection(config);
     db.connect();

     // crear la consulta (seleccion todos los campos en la bd users donde el email sea igua a)
     db.query('SELECT * FROM users WHERE email = ?', email, function(err, rows, failed){
         if(err) throw err;
          
         //cerrar la coneccion a la base de datos 
         db.end();   


         //si la consulta tiene algún registro  
         if(rows.length > 0){
            var user = rows[0];

            //si la contraseña coincide con la contraseña en la base de datos
            if(bcrypt.compareSync(password, user.password)){
               return done(null, {
               	  id: user.id,
               	  nombre: user.nombre,
               	  email: user.email,
               	  documento: user.doc
               });
            }
         }
         
         //si las contraseñas no coinciden
         return done(null, false, req.flash('authmessage', 'Email o contraseña incorrectos.'));
     });

     
    }
    ));

};