// patch material slider to allow float step in discrete sliders
mdc.slider.MDCSliderFoundation.prototype.setStep = eval(mdc.slider.MDCSliderFoundation.prototype.setStep.toSource().replace('||t<1', ''))

const pid = new PID(0.1, 0.1, 0.1);

let pos, speed, size;

const pSlider = new mdc.slider.MDCSlider(document.querySelector('.p-selector'));
const iSlider = new mdc.slider.MDCSlider(document.querySelector('.i-selector'));
const dSlider = new mdc.slider.MDCSlider(document.querySelector('.d-selector'));

function setup() {
    createCanvas(windowWidth, windowHeight);
    pos = createVector(0, height / 2);

    speed = 1;
    size = 50;
}

function draw() {
    background(0);
    stroke(255);
    line(0, height / 2, width, height / 2);
    rectMode(CENTER);
    rect(pos.x, pos.y, size, size);

    if (mouseIsPressed &&
        pmouseX > pos.x - size / 2 &&
        pmouseX < pos.x + size / 2 &&
        pmouseY > pos.y - size / 2 &&
        pmouseY < pos.y + size / 2) {
        pos.x = mouseX;
        pos.y = mouseY;
    } else {
        pid.updateGains(pSlider.value, iSlider.value, dSlider.value);

        const error = height / 2 - pos.y;

        const output = pid.update(error);

        pos.add(speed, output);

        if (pos.x - size / 2 >= width) {
            pos.x = 0;
        }

        if (pos.y >= height - size / 2) {
            pos.y = height - size / 2;
        } else if (pos.y <= size / 2) {
            pos.y = size / 2;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
