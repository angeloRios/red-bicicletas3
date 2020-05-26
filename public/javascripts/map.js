var map = L.map('mapid').setView([40.472, 0.467], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoidmVrdG9yaWFsZGVzaWduIiwiYSI6ImNrNDM0c3FtaTAzeTUzam81djlsbjM2bzAifQ.PTh43pUZpq3lPK4hVeyGHg'
}).addTo(map);
var circle = L.circle([40.4705, 0.4735], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var marker = L.marker([40.4705, 0.4735]).addTo(map);
var marker = L.marker([40.4685, 0.4745]).addTo(map);
var marker = L.marker([40.4665, 0.4725]).addTo(map);

$.ajax({
    dataType:"json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
    result.bicicletas.array.forEach(function(bici){
        L.marker(bici.ubicacion,{title: bici.id}).addTo(map);
    });    
    
    }
})