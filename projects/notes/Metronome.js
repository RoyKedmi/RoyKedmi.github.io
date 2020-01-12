//    Contact me:
//        Roy Kedmi
//        rskedmi@gmail.com
//
//    Big thanks to the internet for giving me knowledge.

export default class Metronome {
    constructor(tempo=90, sample_file="metronomeSamples/Ping Hi.wav") {
        this.tempo = tempo;
        this.audioSample = new Audio(sample_file);
    }

    setTempo(newTempo) {
        this.tempo = newTempo;
    }

    getTempo() {
        return this.tempo;
    }

    start() {
        this.stop();

        var self = this;
        var intervalFunc = function() {self.audioSample.play();};

        //call it once here
        intervalFunc();

        this.interval = setInterval(intervalFunc, 60.0 * 1000.0 / this.tempo);
    }

    stop() {
        clearInterval(this.interval);
    }

}
