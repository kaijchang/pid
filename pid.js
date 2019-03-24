/*
https://www.youtube.com/watch?v=UOuRx9Ujsog

             t
kP * et + kI Σ et + kD(et - et-1)
            i=1

proportional part - current error (et) multiplied by kP
integral part - sum of all past errors (1 to t) multiplied by kI
derivative part - change in error between current error (et) and last error (et-1) multiplied by kD
*/

exports = typeof(exports) == 'undefined' ? window : exports;

exports.PID = function PID(kP, kI, kD) {
    this.kP = kP || 0;
    this.kI = kI || 0;
    this.kD = kD || 0;

    this.e = [];
    this.t = 0;

    this.update = function (error) {
        error = error || 0;

        this.e.push(error);

        const P = this.e[this.t] * this.kP;
        const I = this.e.reduce((acc, cur) => cur + acc, 0) * this.kI;
        const D = (this.e[this.t] - this.e[this.t - 1] || 0) * this.kD;

        this.t++;

        return P + I + D;
    }
};
