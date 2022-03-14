
const inquirer = require('inquirer');
const preguntas = [
    {
        type: 'list',
        name: 'respuestaEscogida', //este sera el nombre del objeto de respuesta
        message: 'Qué desea hacer?',
        choices: [
            { value: 1, name: `${'1.'.green} Buscar ciudad.` },
            { value: 2, name: `${'2.'.green} Historial.` },
            { value: 0, name: `${'0.'.green} Salir.` },
        ]
    }
]

const inquirerMenu = async () => {
    console.clear();
    console.log('=================================='.green);
    console.log('       Seleccione una opción       '.black);
    console.log('==================================\n'.green);
    const { respuestaEscogida } = await inquirer.prompt(preguntas) //muestra la lista de opciones
    return respuestaEscogida;
}
const pausar = async () => {
    const question = [{
        type: 'input', name: 'tecla',
        message: `Presione ${'ENTER'.green} para continuar`
    }]
    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async (mostrar) => {
    const question = [
        {
            type: 'input', 
            name: 'lectura', message: mostrar,
            validate(valorIng) {
                return valorIng.length === 0 ? 'Ingresa un valor' : true; //si no resonde nada
            }
        }
    ];
    const { lectura } = await inquirer.prompt(question);
    return lectura;
}

const listarLugares = async (lugares = []) => {
    const opciones = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });
    opciones.unshift({value:0, name: `${'0'.green} Cancelar`})
    const preguntas = [{
        type: 'list',
        name: 'idSeleccionado',
        message: 'Seleccione lugar:',
        choices: opciones
    }]

    const { idSeleccionado } = await inquirer.prompt(preguntas);
    return idSeleccionado;
}

const confirmar = async (mensaje = '') => {
    const pregunta = [{
        type: 'confirm',
        name: 'ok',
        message: mensaje
    }]
    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}


const mostrarListadoCheckList = async (tareas = []) => {
    const opciones = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.descripcion}`,
            checked: (tarea.completado)? true: false
        }
    });
   
    const pregunta = [{
        type: 'checkbox',
        name: 'idsSelect',
        message: 'Selecciones',
        choices: opciones

    }]

    const { idsSelect } = await inquirer.prompt(pregunta);
    return idsSelect;
}


module.exports = {
    inquirerMenu,
    pausar, leerInput,
    listarLugares,
    confirmar, mostrarListadoCheckList
}
