require('colors');
require('dotenv').config()

const { leerInput, inquirerMenu, pausar, listarLugares } = require('./helpers/inquirer');
const Busqueda = require('./models/busqueda.class');

const main = async () => {

    const busquedas = new Busqueda();
    let opcionSeleccionada;

    do {
        opcionSeleccionada = await inquirerMenu();
        switch (opcionSeleccionada) {
            case 1:
                //mostrar mensaje
                const terminoDeBusqueda = await leerInput('Ciudad a buscar:');
                //en la instancia busquedas se hace la consulta a: mapbox geocoding

                // buscar los lugares
                const lugares = await busquedas.ciudad(terminoDeBusqueda);

                // seleccionar el lugar
                const idSel = await listarLugares(lugares);
                if (idSel === 0) continue;
                const lugarSele = lugares.find((lugar) => {
                    return lugar.id = idSel;
                });

                //guardar en DB
                busquedas.agregarHistorial(lugarSele.nombre)

                //clima
                const { temp, desc, min, max } = await busquedas.climaLugar(lugarSele.lat, lugarSele.lng)

                //mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSele.nombre.green);
                console.log('Lat:', lugarSele.lat);
                console.log('Long:', lugarSele.lng);
                console.log('Temperatura:', temp);
                console.log('mínima:', min);
                console.log('máxima:', max);
                console.log('Clima:', desc.green);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, indice) => { 
                    const idx = `${indice + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }
        if (opcionSeleccionada !== 0) await pausar();

    } while (opcionSeleccionada !== 0)
}

main();