// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    // Almacenamos en constantes los elementos que vamos a necesitar manipular.
    
    // Todos los slides de la presentación
    const slides = document.querySelectorAll('.slide');
    // Botón para ir al slide anterior
    const prevButton = document.getElementById('prev-slide');
    // Botón para ir al slide siguiente
    const nextButton = document.getElementById('next-slide');
    // Indicador de progreso que muestra "Slide X de Y"
    const progressIndicator = document.getElementById('progress-indicator');
    // Contenedor para el código QR en el último slide
    const qrCodeContainer = document.getElementById('qrcode');
    // Botones dentro de los slides que permiten saltar a un slide específico
    const gotoButtons = document.querySelectorAll('[data-goto-slide]');

    // --- ESTADO DE LA APLICACIÓN ---
    // Mantiene un registro del slide que se está mostrando actualmente.
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Muestra un slide específico basado en su índice y actualiza los indicadores.
     * @param {number} index - El índice del slide a mostrar.
     */
    function showSlide(index) {
        // Primero, nos aseguramos de que el índice esté dentro de los límites (de 0 a totalSlides - 1)
        currentSlideIndex = Math.max(0, Math.min(index, totalSlides - 1));

        // Recorremos todos los slides para ocultarlos
        slides.forEach((slide, i) => {
            // Si el índice del slide actual coincide con el que queremos mostrar,
            // le añadimos la clase 'active'. En caso contrario, se la quitamos.
            if (i === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Actualizamos el texto del indicador de progreso.
        updateProgressIndicator();
    }

    /**
     * Pasa al siguiente slide. Si está en el último, vuelve al primero (comportamiento cíclico).
     */
    function nextSlide() {
        // Usamos el operador de módulo (%) para crear un bucle.
        // (currentSlideIndex + 1) % totalSlides -> Si estamos en el último, el resultado será 0.
        const newIndex = (currentSlideIndex + 1) % totalSlides;
        showSlide(newIndex);
    }

    /**
     * Vuelve al slide anterior. Si está en el primero, va al último (comportamiento cíclico).
     */
    function prevSlide() {
        // (currentSlideIndex - 1 + totalSlides) % totalSlides -> Evita índices negativos.
        // Si currentSlideIndex es 0, (0 - 1 + 8) % 8 = 7.
        const newIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        showSlide(newIndex);
    }
    
    /**
     * Actualiza el contenido de texto del indicador de progreso.
     */
    function updateProgressIndicator() {
        if (progressIndicator) {
            progressIndicator.textContent = `Slide ${currentSlideIndex + 1} de ${totalSlides}`;
        }
    }
    
    /**
     * Genera el código QR en el slide final.
     * Utiliza la librería externa QRCode.js cargada en el HTML.
     */
    function generateQRCode() {
        // Verificamos que el contenedor del QR exista para evitar errores.
        if (qrCodeContainer) {
            // Limpiamos el contenedor por si se vuelve a llamar a la función
            qrCodeContainer.innerHTML = ''; 
            // URL que se codificará en el QR
            const url = "https://centropilatedemo.netlify.app/";
            
            // Creamos una nueva instancia de QRCode.
            new QRCode(qrCodeContainer, {
                text: url,
                width: 150,
                height: 150,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }


    // --- ASIGNACIÓN DE EVENTOS (EVENT LISTENERS) ---

    // 1. Click en los botones de navegación (anterior/siguiente)
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }

    // 2. Navegación con el teclado (flechas izquierda/derecha)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // 3. Click en botones internos para saltar a un slide
    gotoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Obtenemos el número del slide del atributo 'data-goto-slide'
            const targetSlideIndex = parseInt(e.currentTarget.getAttribute('data-goto-slide'), 10);
            if (!isNaN(targetSlideIndex)) {
                showSlide(targetSlideIndex);
            }
        });
    });

    // 4. Animación de parpadeo de la mascota
    const mascotOpen = document.getElementById('mascot-open');
    const mascotClosed = document.getElementById('mascot-closed');

    if (mascotOpen && mascotClosed) {
        // Inicia un intervalo que se ejecuta cada 4 segundos.
        setInterval(() => {
            // Muestra la imagen con los ojos cerrados y oculta la de los ojos abiertos.
            mascotOpen.style.opacity = '0';
            mascotClosed.style.opacity = '1';

            // Después de un breve período (200ms), revierte el efecto.
            setTimeout(() => {
                mascotOpen.style.opacity = '1';
                mascotClosed.style.opacity = '0';
            }, 200); // Duración del parpadeo

        }, 4000); // Frecuencia del parpadeo
    }


    // --- INICIALIZACIÓN ---
    
    // Al cargar la página, mostramos el primer slide.
    showSlide(currentSlideIndex);
    
    // Generamos el código QR inmediatamente, ya que estará listo cuando se llegue al último slide.
    generateQRCode();
});
