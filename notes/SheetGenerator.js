//    Contact me:
//        Roy Kedmi
//        rskedmi@gmail.com
//
//    Big thanks to the internet for giving me knowledge.

import "./vexflow-min.js"

export default class SheetGenerator {
    constructor(div_name, sheetWidth=1100, sheetHeight=900, barWidth=250) {
        //this.vf = new Vex.Flow.Factory({renderer: {elementId: div_name}});
        this.sheetWidth = sheetWidth;
        this.sheetHeight = sheetHeight;

        this.vf = new Vex.Flow.Factory({renderer: {elementId: div_name, width: sheetWidth, height: sheetHeight}});
        this.score = this.vf.EasyScore();

        this.voice = this.score.voice.bind(this.score);
        this.notes = this.score.notes.bind(this.score);
        this.beam = this.score.beam.bind(this.score);
        this.registry = new Vex.Flow.Registry();

        this.horizontalCursor = 0;
        this.verticalCursor = 0;

        this.barWidth = barWidth;
        this.barHeight = 230;
        this.barsPerRow = Math.floor(this.sheetWidth / this.barWidth) - 1;
        this.rowsPerSheet = Math.floor(this.sheetHeight / this.barHeight);
    }

    generateNotes() {
        //The Registry object is intended for fast notes query
        Vex.Flow.Registry.enableDefaultRegistry(this.registry);

        var horizontalStart = 120;
        this.horizontalCursor = horizontalStart;
        this.verticalCursor = 0;

        //Force the notes to obay the time signature
        //this.score.set({time : '4/4'});
    
        var isFirstBarInRow = true;
        var isAddedTimeSignature = false;
        var barCount = 0;
        let firstBarExtraSpace = 70;

        let i = 0;
        for (i = 0; i < this.barsPerRow * this.rowsPerSheet; i++) {
            var currentBarWidth = this.barWidth;
            if (isFirstBarInRow) {
                currentBarWidth += firstBarExtraSpace;
            }

            this.system = this._createSystem(currentBarWidth);
            var currentStave = this.system.addStave({
                //voices: [this.score.voice(this.score.notes('C#5/q, B4, A4, G#4'))]
                voices: [this.score.voice(this.score.notes(this._generateNotesForBar(4,4)))]
                });

            if (isFirstBarInRow) {
                currentStave.addClef('treble');
                if (!isAddedTimeSignature) {
                    currentStave.addTimeSignature('4/4');
                }
            }
            currentStave = this.system.addStave({
                voices: [this.score.voice(this.score.notes(this._generateNotesForBar(4,4)))]
                });

            if (isFirstBarInRow) {
                currentStave.addClef('bass');
                if (!isAddedTimeSignature) {
                    currentStave.addTimeSignature('4/4');
                    isAddedTimeSignature = true;
                }
            }
            if (isFirstBarInRow) {
                this.system.addConnector('brace');
            }
            //this.system.addConnector('singleRight');
            //this.system.addConnector('singleLeft');
            this.system.addConnector('singleLeft');
            this.system.addConnector('singleRight');
            barCount += 1;
            isFirstBarInRow = false;
            
            if (barCount % this.barsPerRow == 0) {
                this.verticalCursor += this.barHeight;
                this.horizontalCursor = horizontalStart;
                isFirstBarInRow = true;
            }
        }

        this.system.addConnector('boldDoubleRight')
        this.vf.draw();
        
        //this.vf.draw();
    }

    _generateNotesForBar(numberOfBeats, beatValue) {
        var possibleNotes = ["A", "B", "C", "D", "E", "F", "G"];
        var possibleOctaves = ["3", "4", "5"];
        var possibleTimes = ["1", "2", "4", "8", "16", "32"];
        var possibleTimesValues = [1, 1/2, 1/4, 1/8];

        var timeLeft = numberOfBeats / beatValue;
    
        var result = "";

        while (timeLeft > 0) {
            var [noteIndex, currentNote] = this._getRandomValueFromArray(possibleNotes);
            var [octaveIndex, currentOctave] = this._getRandomValueFromArray(possibleOctaves);
            currentTime = 1000;
            while (currentTime > timeLeft) {
                var [timeIndex, currentTime] = this._getRandomValueFromArray(possibleTimesValues);
            }
            timeLeft -= currentTime;
            result += currentNote + currentOctave + "/" + possibleTimes[timeIndex] + ",";
        }

        return result;
    }

    _getRandomValueFromArray(arr) {
        var randomIndex = Math.floor(Math.random() * arr.length);

        return [randomIndex, arr[randomIndex]];
    }
    _concat(a, b) {
        return a.concat(b);
    }

    _createSystem(width) {
        var system = this.vf.System({ x: this.horizontalCursor, y: this.verticalCursor, width: width, spaceBetweenStaves: 10});
        this.horizontalCursor += width;

        return system;
    }
    
    _getNoteById(id) {
        return this.registry.getElementById(id);
    }
    
    draw() {
        this.vf.draw();
    }
}
