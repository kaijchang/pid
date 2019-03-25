// patch material slider to allow float step in discrete sliders
mdc.slider.MDCSliderFoundation.prototype.setStep =
    eval(mdc.slider.MDCSliderFoundation.prototype.setStep.toSource().replace('||t<1', ''));

let vehicle;

const pSlider = new mdc.slider.MDCSlider(document.querySelector('.p-selector'));
const iSlider = new mdc.slider.MDCSlider(document.querySelector('.i-selector'));
const dSlider = new mdc.slider.MDCSlider(document.querySelector('.d-selector'));

const velocitySlider = new mdc.slider.MDCSlider(document.querySelector('.velocity-selector'));
const turnRadiusSlider = new mdc.slider.MDCSlider(document.querySelector('.turn-radius-selector'));

function PIDVehicle(pos, velocity, size, maxVelocity, turnRadius) {
    this.pid = new PID();
    this.angle = 0;

    this.pos = pos;
    this.velocity = velocity;
    this.size = size;
    this.maxVelocity = maxVelocity;
    this.turnRadius = turnRadius;

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
            pmouseX > this.pos.x - this.size / 2 &&
            pmouseX < this.pos.x + this.size / 2 &&
            pmouseY > this.pos.y - this.size / 2 &&
            pmouseY < this.pos.y + this.size / 2) {
            this.pos.x = mouseX;
            this.pos.y = mouseY;
        } else {
            this.maxVelocity = velocitySlider.value;
            this.turnRadius = turnRadiusSlider.value;

            this.pid.updateGains(pSlider.value, iSlider.value, dSlider.value);

            const error = height / 2 - this.pos.y;

            this.result = this.pid.update(error);

            this.angle = this.result.output;

            this.angle = truncate(this.angle, this.turnRadius);

            const dRadians = this.angle / 180 * Math.PI;
            this.velocity.add(Math.cos(dRadians), Math.sin(dRadians));
            this.velocity.x = truncate(this.velocity.x, this.maxVelocity);
            this.velocity.y = truncate(this.velocity.y, this.maxVelocity);

            this.pos.add(this.velocity);

            if (this.pos.x - this.size / 2 >= width) {
                this.pos.x = -this.size / 2;
            } else if (this.pos.x + this.size / 2 <= 0) {
                this.pos.x = width + size / 2;
            }

            if (this.pos.y >= height - this.size / 2) {
                this.pos.y = height - this.size / 2;
            } else if (this.pos.y <= this.size / 2) {
                this.pos.y = this.size / 2;
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

        for (let term of ['P', 'I', 'D']) {
            push();
            rotate(this.result[term] / 180 * Math.PI);
            stroke([0, 0, 0].map((_, idx) => ['P', 'I', 'D'].indexOf(term) === idx ? 255 : 0));
            line(0, 0, 100, 0);
            pop();
        }

        pop();
    };
}

function setup() {
    createCanvas(windowWidth * 4 / 5, windowHeight);

    vehicle = new PIDVehicle(createVector(0, height / 2), createVector(5, 0), 50, 5, 45);
}

function draw() {
    background(0);
    stroke(255);
    line(0, height / 2, width, height / 2);
    vehicle.update();
    vehicle.draw();
}

function windowResized() {
    resizeCanvas(windowWidth * 4 / 5, windowHeight);
}
