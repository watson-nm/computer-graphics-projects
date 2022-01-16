// Nola Watson
// CSC350
// Project 1

"use strict";

var gl;
var vert_num = 0;
var wallr = 0;
var wallg = 0;
var wallb = 0;

function calculate_walls(vertices, colors, origin_x, origin_y, side, grid_num, squares_arr) {
    var wall_type;
    var x0;
    var y0;
    for (let i = 0; i < grid_num; i++) {
        for (let j = 0; j < grid_num; j++) {
            wall_type = squares_arr[i][j];
            x0 = origin_x + side * j;
            y0 = origin_y + side * i;
            
            switch(wall_type) {
                case 0:
                    // No walls to render
                    break;
                case 1:
                    // Bottom
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 2;
                    break;
                case 2:
                    //Right
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 2;
                    break;
                case 3:
                    // Right & Bottom
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 4:
                    // Top
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 2;
                    break;
                case 5:
                    // Top & Bottom
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 6:
                    // Top & Right
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 7:
                    // Top & Right & Bottom
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 6;
                    break;
                case 8:
                    // Left 
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 2;
                    break;
                case 9:
                    // Left & Bottom
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 10:
                    // Left & Right
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 11:
                    // Left & Right & Bottom
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 6;
                    break;
                case 12:
                    // Left & Top
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 4;
                    break;
                case 13:
                    // Left & Top & Bottom
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 6;
                    break;
                case 14:
                    // Left & Top & Right
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 6;
                    break;
                case 15:
                    // All Sides
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0));
                    colors.push(vec3(wallr, wallg, wallb));
                    vertices.push(vec2(x0 + side, y0 + side));
                    colors.push(vec3(wallr, wallg, wallb));
                    vert_num += 8;
                    break;
            }
        }
    }
}

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    var vertices = [
    ];

    var colors = [
    ];

    var origin_x = -0.8;
    var origin_y = -0.8;

    var side = (canvas.width/18)/200;

    var grid_num = 12;

    var squares_arr = new Array(grid_num);

    for (var i = 0; i < grid_num; i++) {
        squares_arr[i] = new Array(grid_num);
    }

    // Populate Array
    squares_arr[11] = [12, 5, 4, 5, 6, 13, 5, 5, 4, 5, 5, 6];
    squares_arr[10] = [10, 14, 10, 14, 9, 6, 12, 5, 3, 12, 7, 10];
    squares_arr[9] = [8, 3, 10, 9, 5, 1, 2, 14, 12, 2, 12, 3];
    squares_arr[8] = [3,12, 2, 12, 6, 13, 3, 8, 3, 9, 3, 14];
    squares_arr[7] = [12, 3, 11, 10, 9, 5, 6, 9, 6, 13, 5, 2];
    squares_arr[6] = [8, 5, 5, 1, 5, 7, 9, 6, 9, 5, 6, 10];
    squares_arr[5] = [10, 12, 5, 6, 12, 5, 5, 3, 12, 7, 9, 2];
    squares_arr[4] = [10, 10, 14, 10, 10, 13, 4, 4, 3, 12, 5, 3];
    squares_arr[3] = [10, 10, 10, 10, 9, 6, 10, 10, 12, 3, 13, 6];
    squares_arr[2] = [10, 9, 2, 9, 6, 10, 11, 10, 10, 13, 4, 0];
    squares_arr[1] = [10, 14, 10, 14, 11, 9, 6, 10, 9, 5, 3, 10];
    squares_arr[0] = [9, 3, 9, 1, 5, 5, 3, 9, 5, 5, 5, 3];

    calculate_walls(vertices, colors, origin_x, origin_y, side, grid_num, squares_arr);

    console.log(squares_arr);
    console.log(vertices);

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

    for (let i = 0; i < vert_num; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
    }
}
