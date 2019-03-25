// patch material slider to allow float step in discrete sliders
mdc.slider.MDCSliderFoundation.prototype.setStep =
    eval(mdc.slider.MDCSliderFoundation.prototype.setStep.toSource().replace('||t<1', ''));

let vehicle;

const pSlider = new mdc.slider.MDCSlider(document.querySelector('.p-selector'));
const iSlider = new mdc.slider.MDCSlider(document.querySelector('.i-selector'));
const dSlider = new mdc.slider.MDCSlider(document.querySelector('.d-selector'));

function PIDVehicle(pos, velocity, maxVelocity, size) {
    this.pid = new PID(0.1, 0.1, 0.1);
    this.angle = 0;

    this.pos = pos;
    this.velocity = velocity;
    this.maxVelocity = maxVelocity;
    this.size = size;

    function truncate(value, max) {
        if (value > max) {
            return max;
        } else if (value < -max) {
            return - max;
        } else {
            return value;
        }
    }

    this.update = function () {
        if (mouseIsPressed &&
            pmouseX > this.pos.x - size / 2 &&
            pmouseX < this.pos.x + size / 2 &&
            pmouseY > this.pos.y - size / 2 &&
            pmouseY < this.pos.y + size / 2) {
            this.pos.x = mouseX;
            this.pos.y = mouseY;
        } else {
            this.pid.updateGains(pSlider.value, iSlider.value, dSlider.value);

            const error = height / 2 - pos.y;

            this.angle = this.pid.update(error);

            const dRadians = this.angle / 180 * Math.PI;
            this.velocity.add(Math.cos(dRadians), Math.sin(dRadians));
            this.velocity.x = truncate(this.velocity.x, this.maxVelocity);
            this.velocity.y = truncate(this.velocity.y, this.maxVelocity);

            this.pos.add(this.velocity);

            if (this.pos.x - size / 2 >= width) {
                this.pos.x = 0;
            } else if (this.pos.x + size / 2 <= 0) {
                this.pos.x = width;
            }

            if (this.pos.y >= height - size / 2) {
                this.pos.y = height - size / 2;
            } else if (this.pos.y <= size / 2) {
                this.pos.y = size / 2;
            }
        }
    };

    this.draw = function () {
        push();

        translate(this.pos.x, this.pos.y);

        const dRadians = this.angle / 180 * Math.PI;

        rotate(dRadians);

        stroke(255);
        fill(255);

        rectMode(CENTER);
        rect(0, 0, this.size, this.size);
        pop();
    };
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    vehicle = new PIDVehicle(createVector(0, height / 2), createVector(5, 0), 5, 50);
}

function draw() {
    background(0);
    stroke(255);
    line(0, height / 2, width, height / 2);
    vehicle.update();
    vehicle.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
