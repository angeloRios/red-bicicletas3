var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuario', () => {
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, { useNewUrlParser : true });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB Connections Error'));
        db.once('open', function(){
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if(err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if(err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Cuando un usuario reserva una bici', () => {
        it('Debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Miguel' });
            usuario.save();
            var bicicleta = new Bicicleta({ code: 1, color: 'verde', modelo: 'urbana'});
            bicicleta.save();

            var hoy = new Date();
            var manana = new Date();
            manana.setDate(hoy.getDate()+1);

            usuario.reservar( bicicleta.id, hoy, manana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });
});