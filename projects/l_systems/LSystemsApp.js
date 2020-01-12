import LSystem from './LSystem.js'

export default class LSystemsApp {
    constructor() {
        this.initialString = "X";
        this.initialAngle = 0;
        this.turningAngle = 0;
        this.rule1 = "X=F+[[X]-X]-F[-FX]+X";
        this.rule2 = "F=FF";
        this.rule3 = "";
        this.rule4 = "";
        this.numberOfRecurtions = 5;
        this.lineDistance = 5;
        this.lineWidth = 2;
        this.lineColor = "#ffffff";
        this.drawSlowly = false;
        this.linesPerSlowDraw = 1;
        this.currentScale = 1;

        this.initalizeHTMLComponents();
    }

    Generate() {
        var initialPosition = {x: this.canvas.width / 2, y: 0};
        var rules = [this.rule1, this.rule2, this.rule3, this.rule4];
        var formattedRules = [];
        for (let i = 0; i < rules.length; i++) {
            if (rules[i] == "") {
                continue;
            }

            var splittedRule = rules[i].split("=");
            formattedRules.push({indicator: splittedRule[0], turnTo: splittedRule[1]});
        }

        var lSystem = new LSystem(initialPosition,
                                  this.initialAngle,
                                  this.turningAngle,
                                  this.initialString,
                                  formattedRules,
                                  this.numberOfRecurtions,
                                  this.lineDistance,
                                  this.lineWidth,
                                  this.lineColor,
                                  this.linesPerSlowDraw,
                                  this.drawSlowly);

        this.currentLSystem = lSystem;
    }

    getPresets() {
        return { "preset": "Sticks",
                  "closed": false,
                  "remembered": {
                    "Tree": {
                      "0": {
                        "initialString": "X",
                        "initialAngle": 75,
                        "turningAngle": 25,
                        "rule1": "X=F+[[X]-X]-F[-FX]+X",
                        "rule2": "F=FF",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 5,
                        "lineDistance": 8.09844630826344,
                        "lineWidth": 2,
                        "lineColor": "#ffffff",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 33
                      }
                    },
                    "Binary Tree": {
                      "0": {
                        "initialString": "A",
                        "initialAngle": 90,
                        "turningAngle": 45,
                        "rule1": "B=BB",
                        "rule2": "A=B[+A]-A",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 6,
                        "lineDistance": 11.618314313213254,
                        "lineWidth": 2.231999633347083,
                        "lineColor": "#9622b9",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 10
                      }
                    },
                    "Koch Curve": {
                      "0": {
                        "initialString": "F",
                        "initialAngle": 0,
                        "turningAngle": 90,
                        "rule1": "F=F+F-F-F+F",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 3,
                        "lineDistance": 26.871075667995783,
                        "lineWidth": 3,
                        "lineColor": "#008c9f",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 10
                      }
                    },
                    "Sierpinski Triangle": {
                      "0": {
                        "initialString": "F-G-G",
                        "initialAngle": 60,
                        "turningAngle": 120,
                        "rule1": "F=F-G+F+G-F",
                        "rule2": "G=GG",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 5,
                        "lineDistance": 21.591273660571062,
                        "lineWidth": 3,
                        "lineColor": "#820404",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 10
                      }
                    },
                    "Sierpinski Arrowhead": {
                      "0": {
                        "initialString": "A",
                        "initialAngle": 0,
                        "turningAngle": 60,
                        "rule1": "A=B-A-B",
                        "rule2": "B=A+B+A",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 6,
                        "lineDistance": 15.138182318163068,
                        "lineWidth": 3,
                        "lineColor": "#b817b1",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 10
                      }
                    },
                    "Dragon Curve": {
                      "0": {
                        "initialString": "FX",
                        "initialAngle": 0,
                        "turningAngle": 90,
                        "rule1": "X=X+YF+",
                        "rule2": "Y=-FX-Y",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 10,
                        "lineDistance": 22.764562995554332,
                        "lineWidth": 5.751867638296897,
                        "lineColor": "#17b86c",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 10
                      }
                    },
                    "Bush": {
                      "0": {
                        "initialString": "F",
                        "initialAngle": 90,
                        "turningAngle": 22.5,
                        "rule1": "F=FF+[+F-F-F]-[-F+F+F]",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 4,
                        "lineDistance": 14.551537650671435,
                        "lineWidth": 1,
                        "lineColor": "#2e6b4e",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 33
                      }
                    },
                    "Wheat Bush": {
                      "0": {
                        "initialString": "Y",
                        "initialAngle": 90,
                        "turningAngle": 25.700000000000003,
                        "rule1": "X=X[-FFF][+FFF]FX",
                        "rule2": "Y=YFX[+Y][-Y]",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 7,
                        "lineDistance": 6.338512305788532,
                        "lineWidth": 1,
                        "lineColor": "#a1aa5f",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 33
                      }
                    },
                    "Spaceship Bush": {
                      "0": {
                        "initialString": "F",
                        "initialAngle": 90,
                        "turningAngle": 35,
                        "rule1": "F=F[+FF][-FF]F[-F][+F]F",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 4,
                        "lineDistance": 11.03166964572162,
                        "lineWidth": 1,
                        "lineColor": "#c8247b",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 51
                      }
                    },
                    "Weed": {
                      "0": {
                        "initialString": "F",
                        "initialAngle": 90,
                        "turningAngle": 22.5,
                        "rule1": "F=FF-[XY]+[XY]",
                        "rule2": "X=+FY",
                        "rule3": "Y=-FX",
                        "rule4": "",
                        "numberOfRecurtions": 5,
                        "lineDistance": 12.791603648196526,
                        "lineWidth": 1,
                        "lineColor": "#7b24c8",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 51
                      }
                    },
                    "Crystal": {
                      "0": {
                        "initialString": "F+F+F+F",
                        "initialAngle": 90,
                        "turningAngle": 90,
                        "rule1": "F=FF+F++F+F",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 4,
                        "lineDistance": 8.685090975755076,
                        "lineWidth": 1,
                        "lineColor": "#24c8c1",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 51
                      }
                    },
                    "Koch Snowflake": {
                      "0": {
                        "initialString": "F++F++F",
                        "initialAngle": 90,
                        "turningAngle": 60,
                        "rule1": "F=F-F++F-F",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 4,
                        "lineDistance": 8.685090975755076,
                        "lineWidth": 1,
                        "lineColor": "#ffffff",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 13
                      }
                    },
                    "Pentaplexity": {
                      "0": {
                        "initialString": "F++F++F++F++F",
                        "initialAngle": 0,
                        "turningAngle": 36,
                        "rule1": "F=F++F++F|F-F++F",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 3,
                        "lineDistance": 33.32416701040378,
                        "lineWidth": 1,
                        "lineColor": "#c35729",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 13
                      }
                    },
                    "Hexagonal Gosper": {
                      "0": {
                        "initialString": "XF",
                        "initialAngle": 0,
                        "turningAngle": 60,
                        "rule1": "X=X+YF++YF-FX--FXFX-YF+",
                        "rule2": "Y=-FX+YFYF++YF+FX--FX-Y",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 4,
                        "lineDistance": 24.524496998029242,
                        "lineWidth": 1,
                        "lineColor": "#4827e1",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 37
                      }
                    },
                    "Levy Curve": {
                      "0": {
                        "initialString": "F",
                        "initialAngle": 180,
                        "turningAngle": 45,
                        "rule1": "F=-F++F-",
                        "rule2": "",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 11,
                        "lineDistance": 6.338512305788532,
                        "lineWidth": 1,
                        "lineColor": "#c327e1",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 22
                      }
                    },
                    "Sticks": {
                      "0": {
                        "initialString": "X",
                        "initialAngle": 90,
                        "turningAngle": 20,
                        "rule1": "F=FF",
                        "rule2": "X=F[+X]F[-X]+X",
                        "rule3": "",
                        "rule4": "",
                        "numberOfRecurtions": 7,
                        "lineDistance": 2.8186443008387183,
                        "lineWidth": 1,
                        "lineColor": "#91ac86",
                        "drawSlowly": true,
                        "linesPerSlowDraw": 47
                      }
                    }
                  },
                  "folders": {}
                }
    }

    initalizeHTMLComponents() {
        this.gui = new dat.GUI({ autoPlace: false, load: this.getPresets()});
        this.gui.domElement.id = "gui";
        var guiContainer = document.getElementById("datGuiContainer");
        guiContainer.appendChild(this.gui.domElement);
        this.gui.width = 300;
        this.gui.useLocalStorage = true;
        var controls = [];
        this.gui.remember(this);
        controls.push(this.gui.add(this, "initialString"));
        controls.push(this.gui.add(this, "initialAngle", 0, 360, 0.1));
        controls.push(this.gui.add(this, "turningAngle", 0, 360, 0.1));
        controls.push(this.gui.add(this, "rule1"));
        controls.push(this.gui.add(this, "rule2"));
        controls.push(this.gui.add(this, "rule3"));
        controls.push(this.gui.add(this, "rule4"));
        controls.push(this.gui.add(this, "numberOfRecurtions", 0, 30, 1));
        controls.push(this.gui.add(this, "lineDistance", 0, 100));
        controls.push(this.gui.add(this, "lineWidth", 0, 100));
        controls.push(this.gui.addColor(this, "lineColor"));
        controls.push(this.gui.add(this, "drawSlowly"));
        controls.push(this.gui.add(this, "linesPerSlowDraw", 1, 100, 1));
        controls.push(this.gui.add(this, "Generate"));

        for (let i = 0; i < controls.length; i++) {
            controls[i].onFinishChange(() => this.Generate());
        }

        this.canvas = document.createElement("canvas");
        this.canvas.style.backgroundColor = "#000000";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        document.body.appendChild(this.canvas);

        var ctx = this.canvas.getContext("2d");
        ctx.transform(1, 0, 0, -1, 0, this.canvas.height)

        this.startingDragOffset = { x: 0, y: 0 };
        this.lastDragOffset = { x: 0, y: 0 };
        this.dragSensitvity = 1.0;
        this.canvas.addEventListener("mousedown", (e) => {
            this.isShouldDrag = true;

            var x = e.offsetX*this.dragSensitvity;
            var y = e.offsetY*this.dragSensitvity;

            this.startingDragOffset = { x: x - this.lastDragOffset.x,
                                        y: y - this.lastDragOffset.y };
        });

        this.canvas.addEventListener("mouseup", (e) => {
            this.isShouldDrag = false;

            var x = e.offsetX*this.dragSensitvity;
            var y = e.offsetY*this.dragSensitvity;

            this.lastDragOffset = { x: x - this.startingDragOffset.x,
                                    y: y - this.startingDragOffset.y };
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isShouldDrag) {
                return;
            }

            var x = e.offsetX*this.dragSensitvity;
            var y = e.offsetY*this.dragSensitvity;

            var ctx = this.canvas.getContext('2d'); 
            //ctx.setTransform(1, 0, 0, -1,
            ctx.setTransform(this.currentScale, 0, 0, -this.currentScale,
                             x - this.startingDragOffset.x,
                             this.canvas.height + y - this.startingDragOffset.y);

            this.lastDragOffset = { x: x - this.startingDragOffset.x,
                                    y: y - this.startingDragOffset.y };
            this.clearCanvas();
        });

        //this.canvas.addEventListener("mousewheel", (e) => {
        //    var ctx = this.canvas.getContext('2d'); 
        //    var x = e.offsetX;
        //    var y = e.offsetY;
        //    var zoom = e.wheelDelta > 0 ? 0.95 : 1.05;

        //    this.currentScale *= zoom;

        //    ctx.translate(x, y);
        //    ctx.scale(zoom, zoom);
        //    ctx.translate(-x, -y);

        //    this.lastDragOffset = { x: this.startingDragOffset.x*zoom,
        //                            y: this.startingDragOffset.y*zoom };
        //});

        this.canvas.addEventListener("touchstart", (e) => {
            this.isShouldDrag = true;
            var touch = e.touches[0];

            var x = touch.clientX*this.dragSensitvity;
            var y = touch.clientY*this.dragSensitvity;

            this.startingDragOffset = { x: x - this.lastDragOffset.x,
                                        y: y - this.lastDragOffset.y };
        });

        this.canvas.addEventListener("touchend", (e) => {
            this.isShouldDrag = false;
        });

        this.canvas.addEventListener("touchmove", (e) => {
            if (!this.isShouldDrag) {
                return;
            }

            var touch = e.touches[0];

            var x = touch.clientX*this.dragSensitvity;
            var y = touch.clientY*this.dragSensitvity;

            var ctx = this.canvas.getContext('2d'); 
            ctx.setTransform(1, 0, 0, -1,
                             x - this.startingDragOffset.x,
                             this.canvas.height + y - this.startingDragOffset.y);

            this.lastDragOffset = { x: x - this.startingDragOffset.x,
                                    y: y - this.startingDragOffset.y };
        });
    }

    clearCanvas() {
        var ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        ctx.fillRect(-this.canvas.width*20, -this.canvas.height*20, this.canvas.width*40, this.canvas.height*40);
    }

    start() {
        var initialPosition = {x: this.canvas.width / 2, y: 0};

        this.Generate();
        this.lastDeltaTime = Date.now();
        this.appLoop();
    }

    appLoop() {
        this.draw();

        window.requestAnimationFrame(() => { 
            this.appLoop();
        });
    }

    draw() {
        this.clearCanvas();
        
        this.currentLSystem.draw(this.canvas);
        //for (let i = 0; i < this.lSystems.length; i++) {
        //    this.lSystems[i].draw(this.canvas);
        //}
    }

    getRandomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
};
