/*
https://www.youtube.com/watch?v=UOuRx9Ujsog

             t
kP * et + kI Σ et + kD(et - et-1)
            i=1

proportional part - current error (et) multiplied by kP
integral part - sum of all past errors (1 to t) multiplied by kI
derivative part - change in error between current error (et) and last error (et-1) multiplied by kD
*/

const PID = function PID(kP, kI, kD, maxI) {
    this.updateGains = function (kP, kI, kD, maxI) {
        this.kP = kP || 0;
        this.kI = kI || 0;
        this.kD = kD || 0;
        this.maxI = maxI || 25;
    };

    this.update = function (error) {
        error = error || 0;

        this.sumI += error;

        const P = error * this.kP;
        const I = this.sumI * this.kI;
        const D = (error - this.previousE) * this.kD;

        if (this.sumI > this.maxI) {
            this.sumI = this.maxI;
        } else if (this.sumI < -this.maxI) {
            this.sumI = -this.maxI;
        }

        this.previousE = error;

        const output = P + I + D;

        return { P, I, D, output };
    };

    this.updateGains(kP, kI, kD, maxI);

    this.previousE = 0;
    this.sumI = 0;
};
