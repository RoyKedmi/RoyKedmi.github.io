//    Contact me:
//        Roy Kedmi
//        rskedmi@gmail.com
//
//    Big thanks to the internet for giving me knowledge.

var defaultVertexShader = `
attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

var defaultFragmentShader =
`#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    gl_FragColor = vec4(mouse, 0.0, 1.0);
}`;

export default class VimGLSLApp {
    constructor() {
        this.initHTMLComponents();
        this.initalizeWebGL();
        
        this.loadAppData();
        
        this.codeMirror = new Array(10);
        for (var i = 0; i < this.appData.shaders.length; i++) {
            this.codeMirror[i] = CodeMirror(this.rootDiv,
                                         {  lineNumbers: true, 
                                            mode: "glsl",
                                            keyMap: "vim",
                                            matchBrackets: true,
                                            indentwithTabs: true,
                                            indentUnit: 4,
                                            matchBrackets: true,
                                            value: this.appData.shaders[i],
                                            theme: "isotope",
                                         });
            this.codeMirror[i].setSize("0%", "0%");
        }
        this.codeMirror[this.appData.currentTabIndex].setSize("100%", "100%");
        this.codeMirror[this.appData.currentTabIndex].focus();

        this.errorConsole = CodeMirror(this.rootDiv,
                                     {  lineNumbers: true, 
                                        mode: "glsl",
                                        keyMap: "vim",
                                        matchBrackets: true,
                                        indentwithTabs: true,
                                        indentUnit: 4,
                                        matchBrackets: true,
                                        value: "",
                                        readOnly: true,
                                        nocursor: true,
                                        theme: "isotope",
                                     });
        this.errorConsole.setSize("100%", "0%");

        this.isHideCode = false;
        this.clearCanvas();

        this.createBuffer();
        this.compile();
        this.renderLoop();
        this.time = 0;
        this.lastTime = Date.now();
        this.mouseX = 0;
        this.mouseY = 0;
        this.isChangeTabKeyDown = false;

        document.addEventListener('keydown', (keyEvent) => this.handleKeys(keyEvent));
        document.addEventListener('keyup', (keyEvent) => this.handleKeys(keyEvent));
        document.addEventListener('mousemove', (mouseEvent) => this.handleMouse(mouseEvent));
    }

    loadAppData() {
        var appDataItemName = "VimGLSLAppData";

        this.appData = localStorage.getItem(appDataItemName);
        if (this.appData == null) {
            this.appData = { currentTabIndex: 1,
                             shaders: [defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                       defaultFragmentShader,
                                      ] }

            this.saveAppData();
        } else {
            this.appData = JSON.parse(this.appData);
        }
    }
    
    saveAppData() {
        var appDataItemName = "VimGLSLAppData";
        localStorage.setItem(appDataItemName, JSON.stringify(this.appData));
    }

    initHTMLComponents() { 
        this.css = document.createElement("style");
        this.css.type = "text/css";
        this.css.innerHTML = "* {margin:0; padding:0; } html, body { width:100%; height:100%; } canvas {display:block; }";
        document.body.appendChild(this.css);

        this.dynamicCSS = document.createElement("style");
        this.dynamicCSS.type = "text/css";
        this.dynamicCSS.innerHTML = ".CodeMirror {background-color: rgba(0, 0, 0, 0.5)}";
        document.body.appendChild(this.dynamicCSS);

        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.top = "0px";
        this.canvas.style.position = "absolute";
        document.body.appendChild(this.canvas);

        this.rootDiv = document.createElement("div");
        this.rootDiv.id = "rootDiv";

        document.body.appendChild(this.rootDiv);
    }

    initalizeWebGL() {
        try {
            this.gl = this.canvas.getContext("experimental-webgl");

        } catch(e) { }

        if (!this.gl) {
            alert("Could not initalize WebGL");
        }
    }
    
    clearCanvas() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    createBuffer() {
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        var aspect = 1.0;
        var vertices = new Float32Array([
            -1.0, 1.0, 1.0, 1.0, 1.0,-1.0,  // Triangle 1
            -1.0, 1.0, 1.0,-1.0, -1.0,-1.0 // Triangle 2
            ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    }

    createTexture(textureIndex, width, height, wrapS, wrapT, minFilter, magFilter) {
        var texture = this.gl.createTexture();

        this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.FLOAT, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapS);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, minFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, magFilter);

        return texture;
    }

    createFramebuffer(texture) {
        var framebuffer = this.gl.createFramebuffer();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

        return framebuffer;
    }
    
    createShader(source, type) {
        var shaderString = source;

        var shader;
        shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            var errors = this.gl.getShaderInfoLog(shader);
            this.errorConsole.setValue(errors);
            this.codeMirror[this.appData.currentTabIndex].setSize("100%", "70%");
            this.errorConsole.setSize("100%", "30%");

            return null;
        } else { 
            this.codeMirror[this.appData.currentTabIndex].setSize("100%", "100%");
            this.errorConsole.setSize("100%", "0%");
        }

        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log("Could not initalize shaders");
        }

        return program;
    }

    compile() {
        var vertexShader = this.createShader(defaultVertexShader, this.gl.VERTEX_SHADER);
        var fragmentShader = this.createShader(this.codeMirror[this.appData.currentTabIndex].getValue(), this.gl.FRAGMENT_SHADER);

        if (vertexShader != null && fragmentShader != null) {
            this.program = this.createProgram(vertexShader, fragmentShader);
            this.gl.useProgram(this.program);
            this.program.uniforms = {};
            this.program.uniforms["time"] = this.gl.getUniformLocation(this.program, "time");
            this.program.uniforms["resolution"] = this.gl.getUniformLocation(this.program, "resolution");
            this.program.uniforms["mouse"] = this.gl.getUniformLocation(this.program, "mouse");

            this.vertexPosition = this.gl.getAttribLocation(this.program, "position");
            this.gl.enableVertexAttribArray(this.vertexPosition);
            this.gl.vertexAttribPointer(this.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        }
    }

    handleKeys(keyEvent) {
        var changeTabKey = "=";
        if (keyEvent.key == "`" && keyEvent.type == "keydown") {
            this.isHideCode = !this.isHideCode;
            if (this.isHideCode) {
                this.dynamicCSS.innerHTML = ".CodeMirror {visibility: hidden}";
            } else {
                this.dynamicCSS.innerHTML = ".CodeMirror {visibility: visible}";
                this.codeMirror[this.appData.currentTabIndex].focus();
            }
        }

        if (keyEvent.key == changeTabKey && keyEvent.type == "keydown") {
            this.isChangeTabKeyDown = true;
        }

        if (keyEvent.key == changeTabKey && keyEvent.type == "keyup") {
            this.isChangeTabKeyDown = false;
        }

        if (keyEvent.code.startsWith("Digit") && this.isChangeTabKeyDown) {
            this.codeMirror[this.appData.currentTabIndex].setSize("0%", "0%");
            this.appData.currentTabIndex = parseInt(keyEvent.key);
            this.codeMirror[this.appData.currentTabIndex].setSize("100%", "100%");
            this.codeMirror[this.appData.currentTabIndex].focus();
            this.saveAppData();
        }
    }

    handleMouse(mouseEvent) {
        this.mouseX = mouseEvent.clientX / this.canvas.width;
        this.mouseY = 1 - mouseEvent.clientY / this.canvas.height;
    }

    render() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (this.program) {
            this.gl.useProgram(this.program);
            this.gl.uniform1f( this.program.uniforms["time"], this.time);
            this.gl.uniform2f( this.program.uniforms["resolution"], this.canvas.width, this.canvas.height);
            this.gl.uniform2f( this.program.uniforms["mouse"], this.mouseX, this.mouseY);
                    
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        }
    }

    renderLoop() {
        var currentTime = Date.now()
        this.time += (currentTime - this.lastTime) / 1000.0;
        this.lastTime = currentTime;

        this.render();

        this.compile();

        //update the shader source 
        this.appData.shaders[this.appData.currentTabIndex] = this.codeMirror[this.appData.currentTabIndex].getValue();
        this.saveAppData();

        window.requestAnimationFrame(() => this.renderLoop());
    }
}
