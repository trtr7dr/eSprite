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

        this.id = id;
        if (id === undefined)
            console.error('eSprite: not found id for element');

        this.format = format;
        if (this.format === undefined)
            this.format = '.jpeg';

        this.container = document.getElementById(id);

        //  this.img = document.ge

//        if (this.img === undefined) {
//            console.error('eSprite: elements not contain "poster-image"');
//        }

        this.w = this.container.offsetWidth;
        this.h = this.container.offsetHeight;

        let tmp;
        if (limit === undefined) {
            tmp = this.container.getAttribute("data-src-limit");
            this.limit = (tmp === null) ? this.errors('limit') : tmp;
        } else {
            this.limit = limit;
        }
        this.limit -= 1;

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
        window.addEventListener("load", function (event) {
            self.init(id, format, limit, sources, axis);
        });
    }

    events() {
        let self = this;

        this.container.addEventListener("mousemove", function (event) {
            self.part_calculate(event.layerX, event.offsetX);
            self.re_src();
        });
        
        $('#'+this.id).on('touchmove', function(e) {
            let ev = e.originalEvent.touches[0];
            
            self.part_calculate(ev.screenX, ev.clientX);
            self.re_src();
        });
        
    }

    part_calculate(layerX, offsetX) {
        let x, part;
        x = offsetX === undefined ? layerX : offsetX;
        
        part = Math.round((x / this.w) * this.limit);
        
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
        step = (step === 0) ? step + 1 : step;
        //step = (step >= ) ? step + 1 : step;
       // console.log(step);
        $('.esp' + this.id.slice(-1)).css('display', 'none');
        $('.' + this.id + '_num' + step).css('display', 'block');
        //console.log(this.container);
        //console.log(step);
        //this.img.setAttribute('src', this.sources + (step+1) + this.format);
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
            self.re_src(i);
        }

    }
}

// let a360_1 = new eSprite('a360_1', '.webp', 50);
//<div class="esprites" id="idelement" data-src-sources="/path_to_folder/">
//                   <img src="path_to_first_image.format" class="{{name}}_{{num}}_num{{num}} esp{{num}}" width="100%">
//                   @for($i = ...; $i < ...; $i++)
//                   <img src="/path_to_folder/{{$i}}.format" class="{{name}}_{{num}}_num{{$i}} esp{{num}}" style="display: none" width="100%">
//                   @endfor
//</div>
