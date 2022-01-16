// Nola Watson

"use strict";

var gl;
var points;
var nums1 = 0;
var nums2 = 0;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    var vertices = [
    ];

    var colors = [
    ];

    // Circle 1 values
    var r1 = 0.2;
    var x1 = 0.4;
    var y1 = 0.6;

    // Circle 2 values
    var r2 = 0.15;
    var x2 = -0.8;
    var y2 = -0.8;

    // Circle 1
    for (var i = 0; i < Math.PI * 2; i += 0.01) {
        var x = r1 * Math.cos(i) + x1;
        var y = r1 * Math.sin(i) + y1;
        vertices.push(vec2(x, y));
        colors.push(vec3(1, 0, 1));
        nums1 += 1;
    }

    // Circle 2
    for (var i = 0; i < Math.PI * 2; i += 0.01) {
        var x = r2 * Math.cos(i) + x2;
        var y = r2 * Math.sin(i) + y2;
        vertices.push(vec2(x, y));
        colors.push(vec3(0.2, 1, 0.7));
        nums2 += 1;
    }

    // Rectangle
    var ax = 0;
    var ay = 0;
    var l1 = 0.15;
    var l2 = 0.22;
    vertices.push(vec2(ax, ay));
    colors.push(vec3(0.7, 0.03, 0.6));
    vertices.push(vec2(ax + l2, ay));
    colors.push(vec3(0.7, 0.03, 0.6));
    vertices.push(vec2(ax, ay + l1));
    colors.push(vec3(0.7, 0.03, 0.6));
    vertices.push(vec2(ax + l2, ay + l1));
    colors.push(vec3(0.7, 0.03, 0.6));

    this.console.log(vertices);

    // Configure WebGL   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );   
 
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);        
    this.console.log("message");

    // Load the data into the GPU       
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation(program, "vColor");    
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);    

    // Load the data into the GPU       
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
   
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);    

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.drawArrays(gl.TRIANGLE_FAN, 0, nums1);
    gl.drawArrays(gl.LINE_STRIP, nums1, nums2);
    gl.drawArrays(gl.TRIANGLE_STRIP, nums1 + nums2, 4);
}
