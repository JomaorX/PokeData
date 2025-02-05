$(document).ready(function () {
    console.log('Página cargada correctamente');

    const $apiButton = $('#apiButton');
    const $apiButton2 = $('#apiButton2');
    const $apiButton3 = $('#apiButton3');
    const $resultado = $('.resultado');
    const $resultado2 = $('.resultado2');

    let pokemonNames = []; // Variable global para almacenar los nombres de Pokémon
    let aleatorio = null; // Variable para almacenar el Pokémon aleatorio
    let contador = 0;

    // Función principal que se ejecuta al cargar la página
    const init = async () => {
        if (contador === 0) {
            await cargarJSON();
            aleatorio = await pokemonAleatorio();
            callAPI();
            callAPI2();
            console.log("✓ Funciones Iniciadas");
            console.log("El Pokemon oculto es " + aleatorio);
            contador++;
        } else {
            console.clear();
            limpiar();
            aleatorio = await pokemonAleatorio();
            callAPI2();
            console.log("✓ Funciones Iniciadas");
            console.log("El nuevo Pokemon oculto es " + aleatorio);
            const audio = $('#audio');
            audio.addClass('audio-oculto');
            audio[0].pause();
            audio[0].currentTime = 0;
        }
    };

    // Función para cargar el archivo JSON
    const cargarJSON = async () => {
        try {
            const response = await fetch('pokemon_names.json'); // Reemplaza con la ruta correcta
            pokemonNames = await response.json();
            console.log("Archivo JSON cargado");
        } catch (error) {
            console.error("Error al cargar el JSON:", error);
        }
    };

    // Limpiar input
    const limpiar = () => {
        $('#nombrePok2').val('');
        console.log("Input limpiado");
    };

    // Función para generar un Pokémon aleatorio
    const pokemonAleatorio = async () => {
        if (pokemonNames.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * pokemonNames.length);
            return pokemonNames[indiceAleatorio];
        } else {
            console.error("No se ha cargado el archivo JSON aún.");
            return null;
        }
    };

    // Función para llamar a la API con un nombre específico
    const callAPI = () => {
        const nombrePok = $('#nombrePok').val().toLowerCase() || 'bulbasaur';
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePok}`)
            .then(res => res.json())
            .then(data => {
                const speciesUrl = data.species.url;
                $('.resultado').first().html(` <!-- Ensure this targets only the Pokedex section -->
                    <h2 style="display: inline;">${data.name.toUpperCase()} </h2>
                    <h4 style="display: inline;">N.º0${data.id}</h4>
                    <div class="centrar-card">
                        <div class="card">
                            <div class="card-imagen">
                                <img src="${data.sprites.other.dream_world.front_default}" alt="${data.name}">
                            </div>
                            <div class="card-stats">
                                <div class="stats">
                                    <p><strong>Altura:</strong></p>
                                    <p><strong>Peso:</strong></p>
                                    <p><strong>Habilidad:</strong></p>
                                    <p><strong>Tipo:</strong></p>
                                </div>
                                <div class="stats">
                                    <p>${data.height}</p>
                                    <p>${data.weight}</p>
                                    <p>${data.abilities[0].ability.name}</p>
                                    <p>${data.types.map(type => type.type.name).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="evoluciones"></div>
                `);
                return fetch(speciesUrl);
            })
            .then(res => res.json())
            .then(speciesData => {
                const evolutionChainUrl = speciesData.evolution_chain.url;
                return fetch(evolutionChainUrl);
            })
            .then(res => res.json())
            .then(evolutionData => {
                const evoluciones = [];
                let currentEvolution = evolutionData.chain;

                while (currentEvolution) {
                    evoluciones.push(currentEvolution.species);
                    currentEvolution = currentEvolution.evolves_to[0];
                }

                const evolucionesContainer = $('.resultado').first().find('.evoluciones'); // Ensure this targets only the Pokedex section
                evolucionesContainer.html(evoluciones
                    .map((evo, index) => `
                        <div class="ev${index + 1}">
                            <p class="nam">${evo.name.toUpperCase()}</p>
                            <div class="cent">
                                <p class="p${index + 1}">🡺</p>
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromURL(evo.url)}.png" alt="${evo.name}">
                            </div>
                        </div>
                    `).join(''));
            })
            .catch(e => console.error(new Error(e)));
    };

    // Extraer el ID del Pokémon desde la URL
    const getPokemonIdFromURL = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 2];
    };

    // Función para llamar a la API con un Pokémon aleatorio
    const callAPI2 = () => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${aleatorio}`)
            .then(res => res.json())
            .then(data => {
                $('.resultado2').html(` 
                    <h2 class="text-oculto" style="display: inline;">¡Sí, es ${data.name.toUpperCase()}! </h2>
                    <div class="centrar-card">
                        <div class="card">
                            <div class="card-imagen img-oculto">
                                <img class="especial" src="${data.sprites.other.dream_world.front_default}" alt="${data.name}">
                            </div>
                            <div id="mensaje1" class="text-oculto mensaje1">
                                <p>¡Enhorabuena, el Pokémon es <strong>${data.name.toUpperCase()}</strong>!</p>
                            </div>
                            <div id="mensaje2" class="text-oculto mensaje2">
                                <p>¡Ohh lo siento, vuelve a intentarlo!</p>
                            </div>
                            <div class="card-stats">
                                <div class="stats">
                                    <p><strong>Altura:</strong></p>
                                    <p><strong>Peso:</strong></p>
                                    <p><strong>Habilidad:</strong></p>
                                    <p><strong>Tipo:</strong></p>
                                </div>
                                <div class="stats">
                                    <p>${data.height}</p>
                                    <p>${data.weight}</p>
                                    <p>${data.abilities[0].ability.name}</p>
                                    <p>${data.types.map(type => type.type.name).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                        <audio id="audio" class="audio-oculto" src="audios/pokerap.mp3" controls></audio>
                `);
            })
            .catch(e => console.error(new Error(e)));
    };

    // Función para verificar si el usuario adivinó el Pokémon
    const callCual = () => {
        const nombre = $('#nombrePok2').val().toLowerCase().trim();
        const $textOculto = $('.text-oculto');
        const $imgOculto = $('.img-oculto');
        const $audio = $('#audio');
        if (nombre === aleatorio.toLowerCase().trim()) {
            console.log("Has acertado, ¡muy bien!.");
            $textOculto.removeClass('text-oculto');
            $imgOculto.removeClass('img-oculto');
            $audio.removeClass('audio-oculto')[0].play();

            mostrarMensaje(true);
        } else {
            console.log("Ese no es, prueba otra vez.");
            mostrarMensaje(false);
        }
    };

    function mostrarMensaje(acertado) {
        const $mensaje1 = $("#mensaje1");
        const $mensaje2 = $("#mensaje2");
        if (acertado) {
            $mensaje2.addClass('text-oculto'); // Hide failure message
            $mensaje1.removeClass('text-oculto');
            setTimeout(() => {
                $mensaje1.addClass('text-oculto');
            }, 3000);
        } else {
            $mensaje2.removeClass('text-oculto');
            setTimeout(() => {
                $mensaje2.addClass('text-oculto');
            }, 3000);
        }
    };

    // Asignar eventos a los botones
    $apiButton.on('click', callAPI);
    $apiButton2.on('click', callCual);
    $apiButton3.on('click', init);

    // Inicializar al cargar la página
    init();

    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = '#0005'; // Fondo semitransparente
            navbar.style.boxShadow = '0px 0px 50px  #4aAFEF';
        } else {
            navbar.style.backgroundColor = 'var(--fondo-color)';
            navbar.style.boxShadow = '0px 0px 0px  #19AFEF';
        }
    });
});
