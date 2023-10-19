const fs = require('fs');
const axios = require('axios');

class Busquedas {
  historial = ['Mendoza','Buenos Aires','Chubut'];
  dbPath = './db/data.json';

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map( ciudad => {
      let palabras = ciudad.split(' ');
      palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
      return palabras.join(' ');
    })
  }

  get paramsMapBox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'language': 'es'
    }
  }

  get paramsOpenWeather() {
    return {
      lang: 'es',
      units: 'metric',
      apiKey: process.env.OPENWEATHER_KEY
    }
  }

  async ciudad(lugar = "") {

    try{
      // peticion http

      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params: this.paramsMapBox,
      })

      const resp = await instance.get();
      return resp.data.features.map( lugar => (
        {
          id: lugar.id,
          nombre: lugar.place_name,
          lng: lugar.center[0],
          lat: lugar.center[1],
        }
      ))

    } catch( err ) {
      
    }
  }

  async climaLugar( lat, lon ) {

    try {

      // instance de axios.create();
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon } 
      })

      // Petición AXIOS a openWeather
      const resp = await instance.get(); 
      const { weather, main } = resp.data;

      // Descripcion del clima
      const desc = weather[0].description;
      
      // resp.data
      return {
        tempAct: main.temp,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        desc,
      }

    } catch( err ){
      console.log(err);
    }
  } 

  agregarHistorial = ( lugar = '' ) => {

    // TODO prevenir duplicados

    if( this.historial.includes( lugar.toLowerCase() ) ) return;
    this.historial = this.historial.splice(0, 5);

    this.historial.unshift( lugar.toLowerCase() );

    this.guardarDB();

  }

  guardarDB() {

    const payload = {
      historial: this.historial
    }

    fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

  }

  leerDB() {
    if( !fs.existsSync( this.dbPath )) return;

    const historialDB = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
    const data = JSON.parse( historialDB );

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
