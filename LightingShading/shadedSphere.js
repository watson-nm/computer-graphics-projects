// Nola Watson
// CSC 350
// Added menu with options:
//     - Shading 1: Gouraud
//     - Shading 2: Phong
//     - Shading 3: Flat
// Changed:
//     - materialShininess to 10.00
//     - materialAmbient to (0.6, 0.0, 0.5, 1.0)
//     - materialDiffuse to (0.6, 0.0, 0.5, 1.0) 
// Added button 'Toggle light source' for first light source
// Added a second light position for a second light source

"use strict";

var canvas;
var gl;
var program;

var numTimesToSubdivide = 3;

var index = 0;
var shadingType = 0;
var shadingTypeLoc;
var lightType = 0.0;

var positionsArray = [];
var normalsArray = [];

var near = -10;
var far = 10;
var radius = 1.5;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var win_top =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, lightType);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var lightPosition2 = vec4(-1.0, -1.0, -1.0, 0.0);

var materialAmbient = vec4(0.6, 0.0, 0.5, 1.0);
var materialDiffuse = vec4(0.6, 0.0, 0.5, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var nMatrix, nMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var tri_boo = false;

var rad;

function radius(a, b, c) {
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var norm = normalize(cross(t2, t1));
    
    var len = Math.sqrt(Math.pow(norm[0], 2) + Math.pow(norm[1], 2) + Math.pow(norm[2], 2));
    console.log(len);
}

function triangle(a, b, c, boo) {
    if (boo == true) {
        var t1 = subtract(b, a);
        var t2 = subtract(c, a);
        var normal = normalize(cross(t2, t1));

        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));

        positionsArray.push(a);
        positionsArray.push(b);
        positionsArray.push(c);

        index += 3;
    } else {
        positionsArray.push(a);
        positionsArray.push(b);
        positionsArray.push(c);

        // normals are vectors

        normalsArray.push(vec4(a[0],a[1], a[2], 0.0));
        normalsArray.push(vec4(b[0],b[1], b[2], 0.0));
        normalsArray.push(vec4(c[0],c[1], c[2], 0.0));

        index += 3;
    }
}

function divideTriangle(a, b, c, count, boo) {
    if (count > 0) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle(a, ab, ac, count - 1, boo);
        divideTriangle(ab, b, bc, count - 1, boo);
        divideTriangle(bc, c, ac, count - 1, boo);
        divideTriangle(ab, bc, ac, count - 1, boo);
    }
    else {
        triangle(a, b, c, boo);
    }
}


function tetrahedron(a, b, c, d, n, boo) {
    divideTriangle(a, b, c, n, boo);
    divideTriangle(d, c, b, n, boo);
    divideTriangle(a, d, b, n, boo);
    divideTriangle(a, c, d, n, boo);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    center(va, vb, vc);

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide, tri_boo);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
    shadingTypeLoc = gl.getUniformLocation(program, "uShadingType");

    document.getElementById("Button0").onclick = function(){radius *= 2.0;};
    document.getElementById("Button1").onclick = function(){radius *= 0.5;};
    document.getElementById("Button2").onclick = function(){theta += dr;};
    document.getElementById("Button3").onclick = function(){theta -= dr;};
    document.getElementById("Button4").onclick = function(){phi += dr;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};

    document.getElementById("Button6").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        positionsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button7").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        positionsArray = [];
        normalsArray = [];
        init();
    };
    
    var m = document.getElementById("shadingMenu")
    m.onclick = function(){
        shadingType = m.selectedIndex;
        
        if (shadingType == 2) {
            tri_boo = true;
        } else {
            tri_boo = false;
        }
       
        index = 0;
        normalsArray = [];
        init();
    };
    
    document.getElementById("Button8").onclick = function(){
        if (lightType == 0.0) {
            lightType = 1.0;
        } else {
            lightType = 0.0;
        }
    };

    gl.uniform4fv( gl.getUniformLocation(program,
       "uAmbientProduct"), flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uDiffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uSpecularProduct"), flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uLightPosition"), flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "uShininess"), materialShininess );
    gl.uniform1i( gl.getUniformLocation(program,
       "uShadingType"), shadingType);

    gl.uniform4fv( gl.getUniformLocation(program,
       "uLightPosition2"), flatten(lightPosition2) );
    
    render();
}

function render() {
    lightPosition[3] = lightType;
    gl.uniform4fv( gl.getUniformLocation(program,
       "uLightPosition"), flatten(lightPosition) );

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    gl.uniform3fv( gl.getUniformLocation(program,
            "uEyePosition"), eye );
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, win_top, near, far);

    nMatrix = normalMatrix(modelViewMatrix, true );

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));

    for( var i=0; i<index; i+=3)
        gl.drawArrays(gl.TRIANGLES, i, 3);

    requestAnimationFrame(render);
}
