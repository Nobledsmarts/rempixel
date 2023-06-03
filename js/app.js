let form = document.querySelector("form");

const evaluate = (unit) => {
    if (!(/^(.+)\.$/.test(unit))) {
        return Function(`return ${unit}`)();
    } else {
        return unit;
    }
};
const rempixel = {
    base_font : {
        target : 'base_font',
        fn(e) {
            let { base_font, pixels, rem } = getElements();
            pixels.value = isValidExpression(rem.value) ? evaluate(rem.value) * base_font.value : pixels.value;
            rem.value = isValidExpression(pixels.value) ? evaluate(pixels.value) / base_font.value : rem.value;
        }
    },
    pixels : {
        target : 'pixels',
        fn() {
            return delay(_ => {
                let { base_font, pixels, rem } = getElements();

                if (pixels.value) {
                    rem.value = isValidExpression(pixels.value) ? evaluate(pixels.value) / base_font.value : rem.value;
                    pixels.value = isValidExpression(pixels.value) ? evaluate(pixels.value) : pixels.value;
                }
            });
        }
    },
    rem : {
        target : 'rem',
        fn(){
            return delay(_ => {
                let { base_font, pixels, rem } = getElements();

                if (rem.value) {
                    pixels.value = isValidExpression(rem.value) ? evaluate(rem.value) * base_font.value : pixels.value;
                    rem.value = isValidExpression(rem.value) ? evaluate(rem.value) : rem.value;
                }
            })
        }
    },
};

function delay(fn, by = 100){
    let timeout = setTimeout(_ => {
        fn();
        clearTimeout(timeout);
    }, by)
}

for (let el of Object.values(rempixel)) {
    el.target != 'base_font' && getElements()[el.target].addEventListener("input", (e) => [e.preventDefault(), e.isTrusted && el.fn(e)]);
}

getElements().base_font.addEventListener("change", (e) => {
    e.currentTarget.value = evaluate(e.currentTarget.value);
    rempixel.base_font.fn(true);
});

function getElements(element){
    let elements = Object.values(rempixel).reduce((o, key) => ({ 
        ...o,
        [key.target] : form.elements.namedItem(key.target) })
    , {});

    return element ? elements[element] : elements;
}
function isValidExpression(input) {
    let isValid;
    try {
        let output = evaluate(input);
        isValid = isNaN(output) ? false : true;
    } catch (e) {
        isValid = false;
    }
    return isValid;
}
