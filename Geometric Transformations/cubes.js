// Nola Watson
// I added buttons which trigger custom actions for each of the cubes
// The left cube button causes the left cube to grow and shrink, with the z axis scaling opposite to the x and y axis
// The right cube button causes the right cube bounce along the y axix

"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var modelViewMatrixLoc;
var flag = true;
var numElements = 30;
var lFlag = false;
var rFlag = false;
var lVar = 0;
var rVar = 0;
var slink = 1;
var dir = 1;

    var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5,  0.5, -0.5),
        vec3(0.5,  0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
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

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

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

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix"); 
    

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    document.getElementById( "Lcube" ).onclick = function () {
        lFlag = !lFlag;
    };

    document.getElementById( "Rcube" ).onclick = function () {
        rFlag = !rFlag;
    };
    
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    if (lFlag) {
        if (slink == 1) {
            lVar += 0.01;
            if (lVar >= 0.50) {
                slink = slink * -1;
            } 
        } else {
            lVar -= 0.01;
            if (lVar <= 0.02) {
                slink = slink * -1;
            }
        }
    }

    if (rFlag) {
        if (dir == 1) {
            rVar += 0.01;
            if (rVar >= 0.70) {
                dir = dir * -1;
            }
        } else {
            rVar -= 0.01;
            if (rVar <= -0.70) {
                dir = dir * -1;
            }
        }
    }

    console.log(lVar);

    //gl.uniform3fv(thetaLoc, theta);

    var ctm = mat4();

    // translated to the left
    ctm = mult(ctm, translate(-0.5, 0, 0));
    ctm = mult(ctm, rotateX(theta[0]));
    ctm = mult(ctm, rotateY(theta[1]));
    ctm = mult(ctm, rotateZ(theta[2]));
    ctm = mult(ctm, scale(0.25 + lVar, 0.25 + lVar, 0.25 - lVar));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));

    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);

    ctm = mat4();

    // translated to the right
    ctm = mult(ctm, translate(0.5 + rVar, 0, 0));
    ctm = mult(ctm, rotateX(theta[0]));
    ctm = mult(ctm, rotateY(theta[1]));
    ctm = mult(ctm, rotateZ(theta[2]));
    ctm = mult(ctm, scale(0.25, 0.25, 0.25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));

    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}
