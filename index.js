require('dotenv').config();

const { leerInput, inquirerMenu, inquirerPausa, listarLugares } = require("./helpers/inquirer");

// Importamos el modelo 
const Busquedas = require('./models/busquedas');

const main = async () => {

  let opt;
  const busquedas = new Busquedas();

  do{

    opt = await inquirerMenu();

    switch( opt ) {

      case 1:

        // Mostrar mensaje
        const termino = await leerInput();
        
        //Buscar los lugares
        const lugares = await busquedas.ciudad( termino );
        
        // Seleccionar el lugar 
        const id = await listarLugares( lugares );
        if( id === 0 ) {
          continue;
        }
        const lugarSeleccionado = lugares.find( lugar => lugar.id === id );

        busquedas.agregarHistorial( lugarSeleccionado.nombre );

        // Extraemos los datos para enviarlos a las api del clima
        const { lat, lng, nombre } = lugarSeleccionado;
    
        // Clima
        const climaData = await busquedas.climaLugar( lat, lng )
    
        const { tempAct, temp_min, temp_max, desc } = climaData;

        // Mostrar los resultados
        console.clear()
        if( lugarSeleccionado ) {
          console.log('\nInformación de la ciudad\n'.green);
          console.log('Ciudad: ', (nombre).green );
          console.log('Latitud: ', lugarSeleccionado.lat);
          console.log('Longitud: ', lugarSeleccionado.lng);
          console.log('Temperatura: ', tempAct );
          console.log('Mínima: ', temp_min );
          console.log('Máxima: ', temp_max );
          console.log('Como está el clima: ', (desc).green );
        }

      break;

      case 2: 

        busquedas.historialCapitalizado.forEach( (lugar, i) => {
          const idx = `${ i + 1 }`.green;
          console.log(`${ idx } ${ lugar }`);
        });

      break;
    
    }


    await inquirerPausa();

  } while ( opt !== 0 );

}


main();