class SketchyStrategy {
    constructor(element) {
        this.element = element;
    }

    // Méthode abstraite à implémenter pour chaque stratégie
    draw() {
        throw new Error('La méthode "draw" doit être implémentée');
    }

    // Méthode utilitaire pour récupérer ou créer un SVG
    createOrGetSVG() {
        let svg = this.element.querySelector(':scope > svg');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.pointerEvents = 'none'; // Empêche les interactions utilisateur
            this.element.appendChild(svg);

            // Positionnement relatif requis pour l'élément parent
            if (getComputedStyle(this.element).position === 'static') {
                this.element.style.position = 'relative';
            }
        }
        return svg;
    }
}

// --- Stratégie pour les labels ---
class LabelSketchyStrategy extends SketchyStrategy {
    draw() {
        const input = document.getElementById(this.element.htmlFor);
        if (!input) return; // Si aucun input associé, rien à faire

        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        // Ajuste le SVG pour englober l'input associé
        svg.setAttribute('width', input.offsetWidth + 20);
        svg.setAttribute('height', input.offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = `${input.offsetTop - 10}px`;
        svg.style.left = `${input.offsetLeft - 10}px`;

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'input
        const sketchyRect = rc.rectangle(
            10, 10, input.offsetWidth, input.offsetHeight,
            { roughness: 2.5, bowing: 1.5, stroke: '#333', strokeWidth: 2 }
        );
        svg.appendChild(sketchyRect);
    }
}

// --- Stratégie par défaut (autres éléments) ---
class DefaultSketchyStrategy extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;

        // Ajuste le SVG
        svg.setAttribute('width', offsetWidth + 20);
        svg.setAttribute('height', offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = '-10px';
        svg.style.left = '-10px';

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'élément
        const sketchyRect = rc.rectangle(
            10, 10, offsetWidth, offsetHeight,
            { roughness: 2.5, bowing: 1.5, stroke: '#333', strokeWidth: 2 }
        );
        svg.appendChild(sketchyRect);
    }
}

// --- Stratégie pour un element hashuré ---
class HachedFiller extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;
        if(this.color===undefined)
        {
            const style=getComputedStyle(this.element,'background-color');            
            this.color = style['background-color'];
            console.log(this.color);
        }
        // Ajuste le SVG
        svg.setAttribute('width', offsetWidth + 20);
        svg.setAttribute('height', offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = '-10px';
        svg.style.left = '-10px';
        svg.style.zIndex = '-1';
        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'élément
        const sketchyRect = rc.rectangle(
            10, 10, offsetWidth, offsetHeight,
            { 
                roughness: 2.5,
                bowing: 1.5,
                stroke: '#333',
                strokeWidth: 2,
                fill: this.color,         
                fillStyle: 'cross-hatch',
                fillWeight: 3,         
                hachureGap: 16        
            }
        );
        svg.appendChild(sketchyRect);
        this.element.style.backgroundColor = "transparent";
    }
}

// --- Stratégie pour un element en zigzag ---
class ZigzagFiller extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;
        if(this.color===undefined)
        {
            const style=getComputedStyle(this.element,'background-color');            
            this.color = style['background-color'];
            console.log(this.color);
        }
        // Ajuste le SVG
        svg.setAttribute('width', offsetWidth + 20);
        svg.setAttribute('height', offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = '-10px';
        svg.style.left = '-10px';
        svg.style.zIndex = '-1';
        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'élément
        const sketchyRect = rc.rectangle(
            10, 10, offsetWidth, offsetHeight,
            { 
                roughness: 2.5,
                bowing: 1.5,
                stroke: '#333',
                strokeWidth: 2,
                fill: this.color,         
                fillStyle: 'zig-zag',
                fillWeight: 6,         
                hachureGap: 11        
            }
        );
        svg.appendChild(sketchyRect);
        this.element.style.backgroundColor = "transparent";
    }
}

// --- Stratégie pour le corps (body) ---
class PaperLikeStragery extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        // Taille de la fenêtre pour remplir tout le fond
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;

        // Définir les dimensions et le style du SVG
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '-1'; // Envoyer le SVG derrière tous les autres éléments

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Génération des carreaux
        const spacing = 20; // Espacement des lignes
        const strokeColor = '#ddd'; // Couleur des lignes
        const strokeWidth = 0.5; // Épaisseur des lignes

        // Lignes horizontales
        for (let y = 0; y < height; y += spacing) {
            const line = rc.line(0, y, width, y, {
                roughness: 0.5,
                stroke: strokeColor,
                strokeWidth,
            });
            svg.appendChild(line);
        }

        // Lignes verticales
        for (let x = 0; x < width; x += spacing) {
            const line = rc.line(x, 0, x, height, {
                roughness: 0.5,
                stroke: strokeColor,
                strokeWidth,
            });
            svg.appendChild(line);
        }

        // Ajouter une bordure extérieure pour simuler le contour de la feuille A4
        const margin = 10; // Marge pour la bordure
        const sketchyBorder = rc.rectangle(
            margin, margin, width - 2 * margin, height - 2 * margin,
            { roughness: 0.5, stroke: '#bbb', strokeWidth: 1.5 }
        );
        svg.appendChild(sketchyBorder);
    }
}

// --- Factory pour déterminer la stratégie ---
class SketchyStrategyFactory {
    static createStrategy(element) {
        if (element.tagName === 'LABEL') {
            return new LabelSketchyStrategy(element);
        }
        if(element.classList.contains('hached'))
        {
            return new HachedFiller(element);
        }
        if(element.classList.contains('zigzag'))
        {
            return new ZigzagFiller(element);
        }
        if(element.tagName === 'BODY')
        {
            return new PaperLikeStragery(element);
        }

        return new DefaultSketchyStrategy(element);
    }
}

// --- Gestionnaire central ---
class SketchyManager {
    constructor() {
        this.strategies = [];
    }

    // Ajoute une stratégie et applique le dessin
    addElement(element) {
        const strategy = SketchyStrategyFactory.createStrategy(element);
        this.strategies.push(strategy);
        strategy.draw();
    }

    // Redessine tous les éléments
    redrawAll() {
        this.strategies.forEach(strategy => strategy.draw());
    }
}

// --- Exemple d'utilisation ---
window.addEventListener('load', () => {
    const manager = new SketchyManager();

    // Ajoute les éléments au gestionnaire
    manager.addElement(document.getElementById('history'));
    manager.addElement(document.getElementById('formSketch'));

    document.querySelectorAll('.team-member').forEach(member => {
        manager.addElement(member);
    });

    document.querySelectorAll('label').forEach(label => {
        manager.addElement(label);
    });

    manager.addElement(document.getElementById('navbar'));
    manager.addElement(document.querySelector('footer'));
    manager.addElement(document.querySelector('body'));

    // Redessine lors d'un redimensionnement
    window.addEventListener('resize', () => manager.redrawAll());
});
