var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = 'http://localhost:5000/api/bicicletas';

describe('Bicicleta API', () => {
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
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });
    });
    
describe('Bicicleta API', () => {
    describe('GET BICICLETAS /', () => {
        it('status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'roja', 'urbana',[40.4705, 0.4735]);
            Bicicleta.add(a);

            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){

            expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) =>{
            var headers = {'content-type' : 'application/json' };
            var aBici = '{"id": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done();
              
            });
        });
    });

});
