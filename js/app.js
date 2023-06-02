let form = document.querySelector("form");

const val = (unit) => {
    if (!/^(.+)\.$/.test(unit)) {
        let v = Function(`return ${unit}`)();
        return v ? v : 0;
    } else {
        return unit;
    }
};
const rempixel = {
    base_font(e) {
        let isBlur = typeof e == "boolean";
        if (isBlur) {
            let base_font = form.elements.namedItem("base_font").value;
            let { rem, pixels } = getValues();
            form.elements.namedItem("pixels").value = isValidExpression(rem) ? val(rem) * base_font : pixels;
            form.elements.namedItem("rem").value = isValidExpression(pixels) ? val(pixels) / base_font : rem;
        }
    },
    pixels() {
        let pixels = form.elements.namedItem("pixels").value;
        let { base_font, rem } = getValues();

        if (pixels) {
            form.elements.namedItem("rem").value = isValidExpression(pixels) ? val(pixels) / base_font : rem;
            form.elements.namedItem("pixels").value = isValidExpression(pixels) ? val(pixels) : pixels;
        }
    },
    rem() {
        let rem = form.elements.namedItem("rem").value;
        let { base_font, pixels } = getValues();

        if (rem) {
            form.elements.namedItem("pixels").value = isValidExpression(rem) ? val(rem) * base_font : pixels;
            form.elements.namedItem("rem").value = isValidExpression(rem) ? val(rem) : rem;
        }
    },
};

for (let el of Object.keys(rempixel)) {
    form.elements.namedItem(el).addEventListener("input", rempixel[el]);
}

form.elements.namedItem("base_font").addEventListener("blur", (e) => {
    e.currentTarget.value = val(e.currentTarget.value);
    rempixel.base_font(true);
});

function getValues() {
    return {
        base_font: +form.elements.namedItem("base_font").value,
        pixels: +form.elements.namedItem("pixels").value,
        rem: +form.elements.namedItem("rem").value,
    };
}
function isValidExpression(unit) {
    let valid;
    try {
        let v = val(unit);
        valid = isNaN(v) ? false : true;
    } catch (e) {
        valid = false;
    }
    return valid;
}