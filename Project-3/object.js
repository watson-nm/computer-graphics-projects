// Nola Watson
// CSC350
// Project 3

var canvas;
var gl;
var NumVertices  = 0;

var points = [];
var normalsArray = [];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var xc;
var yc;
var zc;

var fovy = 45.0;
var aspect;
var axis = 0;
var near = -10.0;
var far = 10.0;
var radius = 2.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var win_top =1.0;
var bottom = -1.0;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var lightRad = 3.0;
var lightTheta = 0.0;
var lightPhi = 0.0;
var lightDr = 5.0 * Math.PI/180.0;

var materialAmbient = vec4(1.00, 0.84, 0.00, 1.0);
var materialDiffuse = vec4(1.00, 0.84, 0.00, 1.0);
var materialSpecular = vec4(1.00, 0.84, 0.00, 1.0);
var materialShininess = 10.0;

var eyeY = 0.0;
var lightY = 0.0;

var proj_type = false; // False is ortho, true is perspective

var thetaLoc;

var program;

var shadingType = 0;
var shadingTypeLoc;

var isFlat = true;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var nMatrix, nMatrixLoc;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect = canvas.width/canvas.height;
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    
    object();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    
    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
    shadingTypeLoc = gl.getUniformLocation(program, "uShadingType");
    
    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    // event listeners 
    
    window.onkeypress = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch ( key ) {
            case 'w':
                eyeY += 0.05;
                break;
            case 'a':
                theta -= dr;
                break;
            case 's':
                eyeY -= 0.05;
                break;
            case 'd':
                theta += dr;
                break;
            case 'i':
                if (isFlat == true) {
                    lightY -= 0.05;
                } else {
                    lightY += 0.05;
                }
                break;
            case 'j':
                lightTheta -= lightDr;
                break;
            case 'k':
                if (isFlat == true) {
                    lightY += 0.05;
                } else {
                    lightY -= 0.05;
                }
                break;
            case 'l':
                lightTheta += lightDr;
                break;
            case 'o':
                proj_type = false;
                near = -10.0;
                break;
            case 'p':
                proj_type = true;
                near = 1.0;
                break;
            case '+':
                radius += 0.05;
                break;
            case '-':
                radius -= 0.05;
                break;
            case '<':
                lightRad += 0.05;
                console.log(lightRad);
                break;
            case '>':
                lightRad -= 0.05;
                console.log(lightRad);
                break;
        }
    }

    var m = document.getElementById("materialMenu");
    m.onclick = function(){
        var sel = m.selectedIndex;
        
        if (sel == 0) {
            materialAmbient = vec4(1.00, 0.84, 0.00, 1.0);
            materialDiffuse = vec4(1.00, 0.84, 0.00, 1.0);
            materialSpecular = vec4(1.00, 0.84, 0.00, 1.0);
            materialShininess = 10.0;
        }

        if (sel == 1) {
            materialAmbient = vec4(0.75, 0.75, 0.75, 1.0);
            materialDiffuse = vec4(0.75, 0.75, 0.75, 1.0);
            materialSpecular = vec4(0.75, 0.75, 0.75, 1.0);
            materialShininess = 35.0;
        }

        if (sel == 2) {
            materialAmbient = vec4(0.55, 0.47, 0.33, 1.0);
            materialDiffuse = vec4(0.55, 0.47, 0.33, 1.0);
            materialSpecular = vec4(0.55, 0.47, 0.33, 1.0);
            materialShininess = 80.0;
        }
    };

    var s = document.getElementById("shadingMenu")
    s.onclick = function(){
        shadingType = s.selectedIndex;
        
        if (shadingType == 0) {
            isFlat = true;
        } else {
            isFlat = false;
        }
       
        NumVertices = 0;
        normalsArray = [];
        init();
    };

    gl.uniform4fv( gl.getUniformLocation(program,
       "uAmbientProduct"), ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uDiffuseProduct"), diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uSpecularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uLightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "uShininess"),materialShininess );
    gl.uniform1i( gl.getUniformLocation(program,
       "uShadingType"), shadingType);


    render();
}

function triangle(a, b, c) {
    if (isFlat == true) {
        var t1 = subtract(vertices[b-1], vertices[a-1]);
        var t2 = subtract(vertices[c-1], vertices[a-1]);
        var normal = normalize(cross(t2, t1));

        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));

        points.push(vertices[a-1]);
        points.push(vertices[b-1]);
        points.push(vertices[c-1]);
    } else {
        points.push(vertices[a-1]);
        points.push(vertices[b-1]);
        points.push(vertices[c-1]);
        
        var na = vertices[a-1];
        var nb = vertices[b-1];
        var nc = vertices[c-1];

        normalsArray.push(vec4(na[0], na[1], na[2], 0.0));
        normalsArray.push(vec4(nb[0], nb[1], nb[2], 0.0));
        normalsArray.push(vec4(nc[0], nc[1], nc[2], 0.0));
    }

    NumVertices += 3;
}

var vertices = [];

var faces = [];

function object() {
    var i = 0;
    xc = (xmin + xmax)/2;
    yc = (ymin + ymax)/2;
    zc = (zmin + zmax)/2;
    scalex = xmax - xmin;
    scaley = ymax - ymin;
    scalez = zmax - zmin;
    scale = Math.max(scalex, scaley, scalez);
    while (obj[i] == 'v')
    {
        vertices.push(vec3((obj[i+1]-xc)/scale, (obj[i+2]-yc)/scale, (obj[i+3]-zc)/scale));
        i += 4;
    }
    while (obj[i] == 'f')
    {
        faces.push(vec3(obj[i+1], obj[i+2], obj[i+3]));
        i += 4;
    }
    for(var i = 0; i < faces.length; i++)
        triangle(faces[i][0], faces[i][1], faces[i][2]);
}


var render = function() {
    lightPosition = vec4(lightRad*Math.sin(lightTheta), lightY, lightRad*Math.cos(lightTheta), 0);
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
       "uAmbientProduct"), ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uDiffuseProduct"), diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uSpecularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uLightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "uShininess"), materialShininess );
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), eyeY, radius*Math.cos(theta));
    
    at = vec3(xc, yc, zc);
    
    modelViewMatrix = lookAt(eye, at, up);
    
    if (proj_type == true) {
        projectionMatrix = perspective(fovy, aspect, near, far);
    } else {
        projectionMatrix = ortho(left, right, bottom, win_top, near, far);
    }

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimationFrame( render );
}
