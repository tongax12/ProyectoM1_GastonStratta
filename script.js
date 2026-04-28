// ====== FUNCIONES AUXILIARES ======

// Generar un número aleatorio entre min y max
function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ====== FUNCIONES DE GENERACIÓN DE COLORES ======

// Generar un color HSL aleatorio
function generarColorHSL() {
    const hue = generarNumeroAleatorio(0, 360);
    const saturation = generarNumeroAleatorio(50, 100);
    const lightness = generarNumeroAleatorio(40, 80);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generar un color HEX aleatorio
function generarColorHEX() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        const digito = generarNumeroAleatorio(0, 15).toString(16);
        color += digito;
    }
    return color.toUpperCase();
}

// ====== FUNCIONES DE CONVERSIÓN ======

// Convertir HSL a HEX
function HSLaHEX(hsl) {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    
    if (!match) return '#000000';
    
    let h = parseInt(match[1]);
    let s = parseInt(match[2]) / 100;
    let l = parseInt(match[3]) / 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h / 360 + 1/3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1/3);
    }
    
    function toHex(x) {
    const hex = Math.round(x * 255).toString(16);
    return (hex.length === 1 ? '0' + hex : hex).toUpperCase();
}
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// ====== FUNCIONES DE INTERFAZ ======

// Obtener valores de los selects
function obtenerValoresDelFormulario() {
    const selects = document.querySelectorAll('select');
    
    const cantidadValue = selects[0].value;
    const formatoValue = selects[1].value;
    
    return {
        cantidad: parseInt(cantidadValue),
        formato: formatoValue
    };
}

// Validar selecciones
function validarSelecciones() {
    const { cantidad, formato } = obtenerValoresDelFormulario();
    
    if (!cantidad || cantidad === 0) {
        alert('Por favor selecciona una cantidad de colores');
        return false;
    }
    
    if (!formato) {
        alert('Por favor selecciona un formato (HSL o HEX)');
        return false;
    }
    
    return true;
}

// Generar colores según el formato
function generarColores(cantidad, formato) {
    const colores = [];
    
    for (let i = 0; i < cantidad; i++) {
        if (formato === 'HSL') {
            const colorHSL = generarColorHSL();
            const colorHEX = HSLaHEX(colorHSL);
            colores.push({ principal: colorHSL, hex: colorHEX });
        } else if (formato === 'HEX') {
            const colorHEX = generarColorHEX();
            colores.push({ principal: colorHEX, hex: colorHEX });
        }
    }
    
    return colores;
}

// Crear tarjeta de color
function crearTarjetaColor(color, formato) {
    const card = document.createElement('div');
    card.className = 'tarjeta-color';
    
    const colorDisplay = document.createElement('div');
    colorDisplay.className = 'color-display';
    colorDisplay.style.backgroundColor = color.principal;
    
    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';
    
    const colorHex = document.createElement('div');
    colorHex.className = 'color-hex';
    colorHex.innerHTML = `HEX: ${color.hex}`;
    
    colorInfo.appendChild(colorHex);
    
    card.appendChild(colorDisplay);
    card.appendChild(colorInfo);
    
    return card;
}
// Mostrar colores en la section paletaColores
function mostrarColores(colores, formato) {
    const contenedor = document.getElementById('paletaColores');
    
    if (!contenedor) {
        console.error('No se encontró la section paletaColores');
        return;
    }
    
    contenedor.innerHTML = '';
    
    const divColores = document.createElement('div');
    divColores.className = 'contenedor-colores';
    
    colores.forEach(function(color) {
        const tarjeta = crearTarjetaColor(color, formato);
        divColores.appendChild(tarjeta);
    });
    
    contenedor.appendChild(divColores);
}

// ====== FUNCIÓN PRINCIPAL ======

function generarPaleta() {
    if (!validarSelecciones()) {
        return;
    }
    
    const { cantidad, formato } = obtenerValoresDelFormulario();
    const colores = generarColores(cantidad, formato);
    mostrarColores(colores, formato);
}

// ====== EVENT LISTENERS ======

document.addEventListener('DOMContentLoaded', function() {
    const boton = document.getElementById('generaPaleta');
    if (boton) {
        boton.addEventListener('click', generarPaleta);
    }
});