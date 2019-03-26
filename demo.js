const pSlider = $('input[name=P]');
const iSlider = $('input[name=I]');
const dSlider = $('input[name=D]');

const velocitySlider = $('input[name=velocity]');
const turnRadiusSlider = $('input[name=turn-radius]');

const pOutput = $('output[name=P]');
const iOutput = $('output[name=I]');
const dOutput = $('output[name=D]');

const velocityOutput = $('output[name=velocity]');
const turnRadiusOutput = $('output[name=turn-radius]');

pSlider.val(pSlider.attr('value'));
iSlider.val(iSlider.attr('value'));
pSlider.val(dSlider.attr('value'));

velocitySlider.val(velocitySlider.attr('value'));
turnRadiusSlider.val(turnRadiusSlider.attr('value'));

pOutput.text(pSlider.attr('value'));
iOutput.text(iSlider.attr('value'));
dOutput.text(dSlider.attr('value'));

velocityOutput.text(velocitySlider.attr('value'));
turnRadiusOutput.text(turnRadiusSlider.attr('value'));

pSlider.on('input', event => {
    vehicle.pid.updateGains(+$(event.target).val(), vehicle.pid.I, vehicle.pid.D);
    pOutput.text($(event.target).val());
});

iSlider.on('input', event => {
    vehicle.pid.updateGains(vehicle.pid.P, +$(event.target).val(), vehicle.pid.D);
    iOutput.text($(event.target).val());
});

dSlider.on('input', event => {
    vehicle.pid.updateGains(vehicle.pid.P, vehicle.pid.I, +$(event.target).val());
    dOutput.text($(event.target).val());
});

velocitySlider.on('input', event => {
    vehicle.maxVelocity = +$(event.target).val();
    velocityOutput.text($(event.target).val());
});

turnRadiusSlider.on('input', event => {
    vehicle.turnRadius = +$(event.target).val();
    turnRadiusOutput.text($(event.target).val());
});

function PIDVehicle(pos, velocity, size, maxVelocity, turnRadius) {
    this.pid = new PID(0.1, 0.1, 0.1);
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
    createCanvas(windowWidth, windowHeight);

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
    resizeCanvas(windowWidth, windowHeight);
}
