/*
https://www.youtube.com/watch?v=UOuRx9Ujsog

             t
kP * et + kI Σ et + kD(et - et-1)
            i=1

proportional part - current error (et) multiplied by kP
integral part - sum of all past errors (1 to t) multiplied by kI
derivative part - change in error between current error (et) and last error (et-1) multiplied by kD
*/

const PID = function PID(kP, kI, kD, maxI, interval) {
    this.updateGains = function (kP, kI, kD, maxI, interval) {
        this.kP = kP || 0;
        this.kI = kI || 0;
        this.kD = kD || 0;
        this.maxI = maxI || 1000;
        this.interval = interval || 1 / 60;
    };

    this.update = function (error) {
        error = error || 0;

        this.sumI += error * this.interval;

        const P = error * this.kP;
        const I = this.sumI * this.kI;
        const D = (error - this.previousE) / this.interval * this.kD;

        if (this.sumI > this.maxI) {
            this.sumI = this.maxI;
        } else if (this.sumI < -this.maxI) {
            this.sumI = -this.maxI;
        }

        this.previousE = error;

        const output = P + I + D;

        return { P, I, D, output };
    };

    this.updateGains(kP, kI, kD, maxI, interval);

    this.previousE = 0;
    this.sumI = 0;
};
