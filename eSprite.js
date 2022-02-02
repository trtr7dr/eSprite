class eSprite {

    /**
     * Создание экземпляра eSprite.
     *
     * @constructor
     * @param {string} id - id начального блока IMG постером внутри
     * @param {string} format - формат изображений в папке (можно задать через data-src-format)
     * @param {number} limit - число спрайтов (можно задать через data-src-limit)
     * @param {string} sources - папка-источник + префикс изображений (можно задать через data-src-sources)
     * @param {string} axis - ось по которой реализуется движение (x/y) (можно задать через data-src-axis)
     */
    
    init(id, format, limit, sources, axis) {
        if (id === undefined)
            console.error('eSprite: not found id for element');
        if (format === undefined)
            this.format = '.jpeg';

        this.container = document.getElementById(id);

        for (let i = 0; i < this.container.children.length; i++) {
            if (this.container.children[i].tagName === 'IMG') {
                this.img = this.container.children[i];
            }
        }

        if (this.img === undefined) {
            console.error('eSprite: elements not contain "poster-image"');
        }

        this.w = this.container.offsetWidth;
        this.h = this.container.offsetHeight;

        let tmp;
        if (limit === undefined) {
            tmp = this.container.getAttribute("data-src-limit");
            this.limit = (tmp === null) ? this.errors('limit') : tmp;
        } else {
            this.limit = limit;
        }

        axis = (axis === undefined) ? 'x' : axis;
        tmp = this.container.getAttribute("data-src-axis");
        this.axis = (tmp !== null) ? tmp : axis;

        if (sources === undefined) {
            tmp = this.container.getAttribute("data-src-sources");
            this.sources = (tmp === null) ? this.errors('sources') : tmp;
        } else {
            this.sources = sources;
        }
        this.moves = true;
        this.events();
    }

    constructor(id, format, limit, sources, axis) {
        var img = document.getElementById(id);
        var self = this;
        window.addEventListener("load", function(event) {
            self.init(id, format, limit, sources, axis);
        });
    }

    events() {
        let self = this;
        this.container.addEventListener("mouseover", function (event) {
            self.part_calculate(event);
            self.start();
        });
        this.container.addEventListener("mousemove", function (event) {
            if (self.moves) {
                self.part_calculate(event);
                self.re_src();
            }
        });
    }

    part_calculate(event) {
        let x, part;
        if (this.axis === 'x') {
            x = event.offsetX === undefined ? event.layerX : event.offsetX;
            part = Math.round((x / this.w) * this.limit);
        } else {
            x = event.offsetY === undefined ? event.layerY : event.offsetY;
            part = Math.round((x / this.h) * this.limit);
            console.log(part);
        }
        this.part = (part > this.limit) ? this.limit : part;
    }

    errors(e) {
        switch (e) {
            case 'limit':
                console.error('eSprite: elements range not found');
                break;
            case 'sources':
                console.error('eSprite: sources for image not found');
                break;
            default:
                console.error('eSprite: unknown errors');
        }
    }

    re_src(step) {
        step = (step === undefined) ? this.part : step;
        this.img.setAttribute('src', this.sources + step + this.format);
    }

    delay(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    start() {

        var self = this;
        var i = 0;
        this.moves = false;
        for (i = 0; i <= this.part; i++) {
            (function (i) {
                setTimeout(function () {
                    self.re_src(i);
                    if (i === self.part) {
                        self.moves = true;
                    }
                }, 50 * i);
            }(i));
        }

    }
}

let block1 = new eSprite('block1');
let block2 = new eSprite('block2');
