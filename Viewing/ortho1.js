// Nola Watson
// CSC 350
// Key bindings:
// 'w' up, 's' down
// 'a' left, 'd' right
// 'b' backward, 'f' forward
// 'o' look to origin
// '1' look at left cube
// '2' look at right cube
// 'i' look in infinite x direction
// 'j' look in infinite -x direction
// 'k' look in infinite -z direction

// NOTE: cubes do no show up immediately, z must be increased

"use strict";

var canvas;
var gl;

var numPositions  = 36;

var positionsArray = [];
var colorsArray = [];

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5,  0.5, 1.0),
    vec4(0.5,  0.5,  0.5, 1.0),
    vec4(0.5, -0.5,  0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white
];

// indices of the 12 triangles that compise the cube
var indices = [
    1, 0, 3, 2, 255,
    2, 3, 7, 6, 255,
    3, 0, 4, 7, 255,
    6, 5, 1, 2, 255,
    4, 5, 6, 7, 255,
    5, 4, 0, 1, 255
];

var near = -1;
var far = 1;
var radius = 1.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var top1 = 1.0;
var bottom = -1.0;

var eyeX = 0.0;
var eyeY = 0.0;
var eyeZ = 2.0;

var atX = 0.0;
var atY = 0.0;
var atZ = 0.0;

var cube1 = vec3(-0.25, 0, 0);
var cube2 = vec3(0.25, 0, 0);

var modelViewMatrix, projectionMatrix, ctm;
var modelViewMatrixLoc, projectionMatrixLoc, ctmLoc;

var eye = vec3(eyeX, eyeY, eyeZ);
var at = vec3(atX, atY, atZ);
const up = vec3(0.0, 1.0, 0.0);

// quad uses first index to set color for face

function quad(a, b, c, d) {
    positionsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    positionsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    positionsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    positionsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    positionsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    positionsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
}

// Each face determines two triangles

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    aspect =  canvas.width/canvas.height;
    console.log(aspect);

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    ctmLoc = gl.getUniformLocation(program, "uCtm");

    // buttons to change viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1; console.log("near: " + near + ", far: " + far);};
    
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};

    window.onkeypress = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch ( key ) {
            case 'a':
                eyeX -= 0.05;
                break;
            case 'd':
                eyeX += 0.05;
                break;
            case 'w':
                eyeY += 0.05;
                break;
            case 's':
                eyeY -= 0.05;
                break;
            case 'b':
                eyeZ += 0.05;
                break;
            case 'f':
                eyeZ -= 0.05;
                break;
            case 'o':
                atX = 0.00;
                atY = 0.00;
                atZ = 0.00;
                break;
            case '1':
                atX = cube1[0];
                atY = cube1[1];
                atZ = cube1[2];
                break;
            case '2':
                atX = cube2[0];
                atY = cube2[1];
                atZ = cube2[2];
                break;
            case 'i':
                atX = 100;
                break;
            case 'j':
                atX = -100;
                break;
            case 'k':
                atZ = -100;
                break;
        }
    };

    render();
}


var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(eyeX, eyeY, eyeZ);
    at = vec3(atX, atY, atZ);

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    ctm = mat4();
    ctm = mult(ctm, translate(cube1[0], cube1[1], cube1[2]));
    ctm = mult(ctm, scale(0.25, 0.25, 0.25));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    ctm = mat4();
    ctm = mult(ctm, translate(cube2[0], cube2[1], cube2[2]));
    ctm = mult(ctm, scale(0.25, 0.25, 0.25));

    gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    requestAnimationFrame(render);
}
