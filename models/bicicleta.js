var moongose = require('mongoose');
var Schema = moongose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion:{
            type: [Number], index: {type: '2dsphere', sparse: true}
    }

});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function() {
    return 'code: ' + this.code + ' | color: ' + this.color;
};

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({}, cb);
};
bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb);
};

bicicletaSchema.statics.findByCode = function(aCode,cb){
    return this.findOne({code: aCode}, cb);
};

bicicletaSchema.statics.removeByCode = function(aCode,cb){
    return this.deleteOne({code: aCode}, cb);
};

bicicletaSchema.statics.updateBici = function(aBici, cb){
    this.findOneAndUpdate({ code: aBici.code },{ $set:{ color: aBici.color, modelo: aBici.modelo, ubicacion: aBici.ubicacion } }, { new: true } , function(err, result){
        if (err) {
            return console.log("error de consulta");
        } else {
            return console.log(result);
        };
    })
};

module.exports = moongose.model('Bicicleta', bicicletaSchema);