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
            // Empêche les interactions utilisateur
            svg.style.pointerEvents = 'none'; 
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
class LabelSketch extends SketchyStrategy {
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
class DefaultSketchy extends SketchyStrategy {
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

// --- Stratégie pour un element hashuré ---
class ZigzagFillers extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;
        if(this.color===undefined)
        {
            const style=getComputedStyle(this.element,'background-color');            
            this.color = style['background-color'];
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
                fillWeight: 12,         
                hachureGap: 12        
            }
        );
        svg.appendChild(sketchyRect);
        this.element.style.backgroundColor = "transparent";
    }
}

// --- Stratégie pour un burger menu ---
class SketchyBurgerMenu extends SketchyStrategy{
    constructor(element, color, backgroundColor)
    {
        super(element);
        this.color = color;
        this.backgroundColor = backgroundColor;
    }
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        // Taille de la fenêtre pour remplir tout le fond
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
    
        if(this.backgroundColor === undefined)
        {
            const style=getComputedStyle(this.element,'background-color');
            this.backgroundColor = style['background-color'];
        }
        if(this.color === undefined)
        {
            const style=getComputedStyle(this.element,'color');
            this.color = style['color'];
        }
        console.log(this.color);
        console.log(this.backgroundColor);
            // Définir les dimensions et le style du SVG
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '1'; // Envoyer le SVG derrière tous les autres éléments

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Génération des carreaux
        const spacing = 15; // Espacement des lignes
        const strokeColor = String(this.color); // Couleur des lignes
        const strokeWidth = 0.5; // Épaisseur des lignes
        const fillColor = String(this.backgroundColor); //
        // Lignes horizontales
        const sketchyRect = rc.rectangle(
            0, 0, width+3, height+3,
            { 
                roughness: 0.5,
                fillStroke: 'none',
                fill: fillColor,         
                fillStyle: 'cross-hached',
                fillWeight: 6,         
                hachureGap: 9                          
            }
        );
        svg.appendChild(sketchyRect);

        for (let y = 0; y < 3; y ++) {
            const line = rc.line(5, y*spacing, width-5, y*spacing, {
                roughness: 0.5,
                bowing: .5,
                stroke: strokeColor,
                strokeWidth: 6,  
            });
            svg.appendChild(line);
        }
        
        this.element.style.backgroundColor = "transparent";
    }
}

// --- Stratégie pour un arrière plan d'element en zigzag ---
class FilledSketch extends SketchyStrategy {    
    constructor(element,style) {
        super(element);
        this.style = style;
    }
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;
        if(this.color===undefined)
        {
            const style=getComputedStyle(this.element,'background-color');            
            this.color = style['background-color'];
        }
        if(this.style==undefined||"")
        {
            this.style="cross-hached";
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
                fillStyle: `${this.style}`,
                fillWeight: 6,         
                hachureGap: 11        
            }
        );
        console.log(sketchyRect);
        svg.appendChild(sketchyRect);
        this.element.style.backgroundColor = "transparent";
    }
}

// --- Stratégie pour un remplissage en quadrillage de fueille A4 ---
class PaperLikeSketch extends SketchyStrategy {
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
            return new LabelSketch(element);
        }
        if(element.classList.contains('hached'))
        {
            return new HachedFiller(element);
        }
        if(element.classList.contains('zigzag'))
        {
            return new ZigzagFillers(element);
        }
        if(element.classList.contains('dots'))
        {
            return new FilledSketch(element,'dots');
        }
        if(element.classList.contains('SketchyBurger'))
        {
            return new SketchyBurgerMenu(element, undefined,undefined);
        }
        if(element.tagName === 'BODY')
        {
            return new PaperLikeSketch(element);
        }

        return new DefaultSketchy(element);
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
    manager.addElement(document.querySelector('.menu-button'))
    // Redessine lors d'un redimensionnement
    window.addEventListener('resize', () => manager.redrawAll());
});
