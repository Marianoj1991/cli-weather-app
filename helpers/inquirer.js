const inquirer = require('inquirer');
require('colors');

const questions = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`
      },
      {
        value: 2,
        name: `${'2.'.green} Historial`
      },
      {
        value: 0,
        name: `${'0.'.green} Salir`
      }
    ],
  }
];

const inquirerMenu = async () => {

  console.clear();

  console.log("=========================".green);
  console.log(`${'  Seleccione una opción'.white}`);
  console.log("=========================\n".green);

  const { opcion } = await inquirer.prompt( questions );

  return opcion;

}

const inquirerPausa = async () => {

  const questionsPausa = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'ENTER'.green} para continuar`,
    }
  ]

  console.log('\n')

  await inquirer.prompt( questionsPausa )
}

const leerInput = async ( message ) => {

  const question = [
    {
      type: 'input', 
      name: 'desc', 
      message,
      validate( value ) {
        if( value.length === 0 ) {
          return 'Ingrese el input'
        }
        return true;
      }
   }
  ]; 

  const { desc }  = await inquirer.prompt( question )
  return desc;

}

const listarLugares = async ( lugares = [] ) => {

  const choices = lugares.map( (lugar, i) => {

    const index = `${i + 1}.`.green;
    return {      
        value: lugar.id,
        name: `${ index } ${ lugar.nombre }`
    }
  });

  choices.unshift( {
    value: 0,
    name: '0.'.green + ' Cancelar',
  })

  const questions = [
    {
      type: 'list',
      name: 'id',
      message: 'Elegir lugar: ',
      choices,
    }
  ]

  const {id} = await inquirer.prompt( questions );
  return id;

}

const inquirerMostrarListadoChecklist = async ( tareas = [] ) => {

  const choices = tareas.map( (tarea, i) => {

    const index = `${i + 1}.`.green;
    return {      
        value: tarea.id,
        name: `${index} ${tarea.desc}`,
        checked: ( tarea.completadoEn ) ? true : false,
    }
  });

  const questions = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Seleccione la(s) tarea(s) a completar',
      choices,
    }
  ]

  const {ids} = await inquirer.prompt( questions );
  return ids;

}

const inquirerConfirmar = async ( message ) => {

  const questions = {
    type: 'confirm',
    name: 'ok',
    message,
  }

  const { ok } = await inquirer.prompt( questions );
  return ok;

} 

module.exports = {

  inquirerMenu,
  inquirerPausa,
  leerInput,
  listarLugares,
  inquirerConfirmar,
  inquirerMostrarListadoChecklist,

}
