// Nola Watson

"use strict"

var gl;

var theta = 0.0;
var thetaLoc;

var x = 0;
var xloc;
var y = 0;
var yloc;

var color = vec4(0.0, 0.0, 0.0, 1.0);
var colorloc;
var cidx = 0;

var speed = 100;
var direction = true;
var intensity = 1.0;
var intensity_vec = vec3(intensity, intensity, intensity);

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    var vertices = [
        vec2(0,  1),
        vec2(-1,  0),
        vec2(1,  0),
        vec2(0, -1)
    ];


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    xloc = gl.getUniformLocation(program, "posX");
    yloc = gl.getUniformLocation(program, "posY");
    colorloc = gl.getUniformLocation(program, "color"); 

    // Initialize event handlers

    document.getElementById("slider").onchange = function(event) {
        intensity = (event.target.value)/100;
        intensity_vec = vec4(intensity, intensity, intensity, intensity);
    };

    document.getElementById("Direction").onclick = function(event) {
        direction = !direction;
    };

    
    document.getElementById("Colors").onclick = function (event) {
        switch(event.target.index) {
            case 0:
                cidx = 0;
                break;
            case 1:
                cidx = 1;
                break;
            case 2:
                cidx = 2;
                break;
            case 3:
                cidx = 3;
                break;
            case 4:
                cidx = 4;
                break;
            case 5:
                cidx = 5;
                break;
            case 6:
                cidx = 6;
                break;
        }
    };

    canvas.addEventListener("mousedown", function(event) {
        x = 2*(event.clientX - this.getBoundingClientRect().left)/canvas.width-1;
        y = 2*(canvas.height - (event.clientY - this.getBoundingClientRect().top))/canvas.height-1;
       //x = (2 * (event.clientX - this.getBoundingClientRect().left))/(canvas.width - 1);
       // y = (2 * (canvas.height - (event.clientY - this.getBoundingClientRect().top)))/(canvas.height - 1);
    });

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : 0);
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(xloc, x);
    gl.uniform1f(yloc, y);
    gl.uniform4fv(colorloc, color);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function () {requestAnimationFrame(render);},
        color = vec4(colors[cidx][0] * intensity_vec[0], colors[cidx][1] * intensity_vec[1], colors[cidx][2] * intensity_vec[2], colors[cidx][3])
    );
}
