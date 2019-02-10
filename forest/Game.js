//    Contact me:
//        Roy Kedmi
//        rskedmi@gmail.com
//
//    Big thanks to the internet for giving me knowledge.

export default class Game {
    constructor() {
        this.assets = {};
        this.assets.imgNames = [["background0.png", 0.1],
                                ["background1.png", 0.1],
                                ["background2.png", 0.4],
                                ["lights3.png", 0.6],
                                ["background4.png", 0.7],
                                ["background5.png", 0.8],
                                ["lights6.png", 0.9],
                                ["background7.png", 1.0],
                                ["foreground8.png", 1.1],
                                ["grass9.png", 1.2],
                                ["foreground10.png", 1.3],
                               ];
        this.assets.imgs = {};
        this.keydowns = {"ArrowRight": false, 
                         "ArrowLeft" : false,
                        };
    }

    initalize() {
        //Create the canvas
        this.canvas = document.createElement("canvas");
        this.canvas.id = "gameCanvas";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        //this.canvas.width = 928;
        //this.canvas.height = 409;
        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.appendChild(this.canvas);
        this.canvas.ctx = this.canvas.getContext("2d");

        this.clearCanvas();

        //loading all images
        for (const imgDef of this.assets.imgNames) {
            //console.log(imgDef);
            //console.log(imgDef[0]);
            this.assets.imgs[imgDef[0]] = new Image();
            this.assets.imgs[imgDef[0]].src = "./assets/img/" + imgDef[0];
            this.assets.imgs[imgDef[0]].offsetXScale = imgDef[1];
            this.assets.imgs[imgDef[0]].offsetX = 0;
            this.assets.imgs[imgDef[0]].offsetY = 0;
            this.assets.imgs[imgDef[0]].onload = () => {};
        }

        //setup the key handlers
        document.addEventListener("keydown", (event) => this.keyEvent(event));
        document.addEventListener("keyup", (event) => this.keyEvent(event));
        document.addEventListener("click", (event) => openFullscreen());

        
    }

    keyEvent(event) {
        for (var key in this.keydowns) {
            if (key == event.code) {
                if (event.type == "keydown") {
                    this.keydowns[key] = true;
                }

                if (event.type == "keyup") {
                    this.keydowns[key] = false;
                }
            }
        }
    }

    keyUpdate() {
        if (this.keydowns["ArrowRight"]) {
            for (var imgName in this.assets.imgs) {
                var currentImg = this.assets.imgs[imgName];
                currentImg.offsetX += 1 * currentImg.offsetXScale;
                currentImg.offsetX = currentImg.offsetX % currentImg.width;
            }
        }

        if (this.keydowns["ArrowLeft"]) {
            for (var imgName in this.assets.imgs) {
                var currentImg = this.assets.imgs[imgName];
                currentImg.offsetX -= 1 * currentImg.offsetXScale;
                currentImg.offsetX = currentImg.offsetX % currentImg.width;
            }
        }
    }

    clearCanvas() {
        this.canvas.ctx.fillStyle = "black";
        this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.clearCanvas();
        for (var imgName in this.assets.imgs) {
            var currentImg = this.assets.imgs[imgName];
            var i = 0;
            var canvasRatio = this.canvas.height / currentImg.height;
            //console.log(canvasRatio);
            for (var w = 0; w < this.canvas.width;) {
                if (w == 0) {
                    this.canvas.ctx.drawImage(currentImg, 
                                              currentImg.offsetX, 
                                              currentImg.offsetY, 
                                              currentImg.width, 
                                              currentImg.height, 
                                              w, 
                                              0, 
                                              currentImg.width*canvasRatio,
                                              this.canvas.height);
                    w += currentImg.width*canvasRatio - currentImg.offsetX*canvasRatio;
                } else {
                    this.canvas.ctx.drawImage(currentImg, 
                                              0,
                                              0,
                                              currentImg.width, 
                                              currentImg.height, 
                                              w, 
                                              0, 
                                              currentImg.width*canvasRatio,
                                              this.canvas.height);
                    w += currentImg.width*canvasRatio;
                }
                //break;

                i += 1;
            }
        }
    }

    run() {
        setInterval(() => this.gameloop(), 1000 / 100);
    }

    gameloop() {
        for (var imgName in this.assets.imgs) {
            var currentImg = this.assets.imgs[imgName];
            currentImg.offsetX += 1 * currentImg.offsetXScale;
            currentImg.offsetX = currentImg.offsetX % currentImg.width;
        }
        this.keyUpdate();
        this.draw();
    }
}


/* View in fullscreen */
function openFullscreen() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
