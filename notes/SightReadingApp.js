//    Contact me:
//        Roy Kedmi
//        rskedmi@gmail.com
//
//    Big thanks to the internet for giving me knowledge.

import SheetGenerator from './SheetGenerator.js'
import Metronome from './Metronome.js' 

export default class SightReadingApp {
    constructor() {
        this.metronome = new Metronome();
    }

    initalizeComponents() {
        var self = this;

        var sheetDivId = "sheetDiv";
        this.sheetDiv = document.createElement("div");
        this.sheetDiv.setAttribute("id", sheetDivId);
        document.body.appendChild(this.sheetDiv);

        this.sheetGenerator = new SheetGenerator(sheetDivId);
        this.sheetGenerator.generateNotes();

        //Metronome start button
        this.startMetronomeButton = document.createElement("button");
        this.startMetronomeButton.appendChild(document.createTextNode("Start"));
        this.startMetronomeButton.onclick = function() {
                                                self.metronome.stop();
                                                self.metronome.setTempo(parseInt(self.tempoTextBox.value));
                                                self.metronome.start();
                                            };
        document.body.appendChild(this.startMetronomeButton);

        //Metronome stop button
        this.stopMetronomeButton = document.createElement("button");
        this.stopMetronomeButton.appendChild(document.createTextNode("Stop"));
        this.stopMetronomeButton.onclick = function() {self.metronome.stop();};
        document.body.appendChild(this.stopMetronomeButton);

        this.tempoTextBox = document.createElement("input");
        this.tempoTextBox.setAttribute("type", "text");
        this.tempoTextBox.setAttribute("value", this.metronome.getTempo());
        document.body.appendChild(this.tempoTextBox);
    }
}

