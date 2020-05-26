var mongoose = require('mongoose');
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const saltRounds = 10;

const Token = require('../models/token');
const mailer = ('../mailer/mailer');


var Schema = mongoose.Schema;

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 
    return re.test(email);
  };
var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate:  [validateEmail, 'Por favor, ingrese un email válido'],
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
        
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },

    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.' });

usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSyncl(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
} 

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({
        usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
        console.log(reserva);
        reserva.save(cb);

}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err){
        if (err) {return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificación de la cuenta',
            text: 'Hola,\n\n' + 'Para verificar su cuenta haga clic en el siguiente enlace: \n' + 'http://localhost:5000'+ '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function (err) {
            if (err) { return console.log(err.message); }

            console.log('A verification email has been sent to ' + email_destination + '.');

        });
    });

}
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(
      condition,
      callback
    ) {};

module.exports = mongoose.model('Usuario', usuarioSchema);
