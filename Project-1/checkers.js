// Nola Watson
// CSC350
// Project 1

"use strict";

var gl;
var board_vertices = 0;
var board_outline_vertices = 0;
var board_total;
var circle_increment = 0.01;
var vert_in_a_circle = Math.ceil((Math.PI * 2)/circle_increment);
var circle_vertices = 0;
var circle_outline_vertices = 0;
var number_circles = 0;
var number_outline_circles = 0;

// When putting circles
// center is side * i + side/2

function draw_circle(vertices, colors, x0, y0, side, r, g, b) {
    var rad = (side - 0.08)/2;
    var nums = 0;

    for (var i = 0; i < Math.PI * 2; i += circle_increment) {
        var x = rad * Math.cos(i) + x0;
        var y = rad * Math.sin(i) + y0;
        vertices.push(vec2(x, y));
        colors.push(vec3(r, g, b));
        nums += 1;
    }

    return nums;
}

function draw_circles(vertices, colors, origin_x, origin_y, side, r1, g1, b1, r2, g2, b2, grid_num) {
    var x0;
    var y0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < grid_num; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                x0 = origin_x + (side * j) + (side/2);
                y0 = origin_y + (side * i) + (side/2);

                circle_vertices += draw_circle(vertices, colors, x0, y0, side, r1, g1, b1);
                number_circles += 1;
            } 
        }
    }

    for (let i = grid_num - 3; i < grid_num; i++) {
        for (let j = 0; j < grid_num; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                x0 = origin_x + (side * j) + (side/2);
                y0 = origin_y + (side * i) + (side/2);

                circle_vertices += draw_circle(vertices, colors, x0, y0, side, r2, g2, b2);
                number_circles += 1;
            } 
        }
    }
}

function draw_circles_outlines(vertices, colors, origin_x, origin_y, side, r1, g1, b1, grid_num) {
    var x0;
    var y0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < grid_num; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                x0 = origin_x + (side * j) + (side/2);
                y0 = origin_y + (side * i) + (side/2);

                circle_outline_vertices += draw_circle(vertices, colors, x0, y0, side, r1, g1, b1);
                number_outline_circles += 1;
            } 
        }
    }

    for (let i = grid_num - 3; i < grid_num; i++) {
        for (let j = 0; j < grid_num; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                x0 = origin_x + (side * j) + (side/2);
                y0 = origin_y + (side * i) + (side/2);

                circle_outline_vertices += draw_circle(vertices, colors, x0, y0, side, r1, g1, b1);
                number_outline_circles += 1;
            } 
        }
    }
}

function draw_board(vertices, colors, origin_x, origin_y, side, r1, g1, b1, r2, g2, b2, grid_num) {
    var x0;
    var y0;
    for (var i = 0; i < grid_num; i++) {
        for (var j = 0; j < grid_num; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                x0 = origin_x + j * side;
                y0 = origin_y + i * side;

                vertices.push(vec2(x0, y0));
                colors.push(vec3(r1, g1, b1));
                vertices.push(vec2(x0 + side, y0));
                colors.push(vec3(r1, g1, b1));
                vertices.push(vec2(x0, y0 + side));
                colors.push(vec3(r1, g1, b1));
                vertices.push(vec2(x0 + side, y0 + side));
                colors.push(vec3(r1, g1, b1));

                board_vertices += 4;
            } else if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
                x0 = origin_x + j * side;
                y0 = origin_y + i * side;

                vertices.push(vec2(x0, y0));
                colors.push(vec3(r2, g2, b2));
                vertices.push(vec2(x0 + side, y0));
                colors.push(vec3(r2, g2, b2));
                vertices.push(vec2(x0, y0 + side));
                colors.push(vec3(r2, g2, b2));
                vertices.push(vec2(x0 + side, y0 + side));
                colors.push(vec3(r2, g2, b2));

                board_vertices += 4;
            }
        }
    }
}

function draw_board_outline(vertices, colors, origin_x, origin_y, side, grid_num) {
    var x0 = origin_x;
    var y0 = origin_y;

    var len = side * grid_num;

    for (var i = 0; i < grid_num + 1; i++) {
        vertices.push(vec2(x0 + side * i, y0));
        colors.push(vec3(0, 0, 0));
        vertices.push(vec2(x0 + side * i, y0 + len));
        colors.push(vec3(0, 0, 0));
        board_outline_vertices += 2;
    }

    for (var i = 0; i < grid_num + 1; i++) {
        vertices.push(vec2(x0, y0 + side * i));
        colors.push(vec3(0, 0, 0));
        vertices.push(vec2(x0 + len, y0 + side * i));
        colors.push(vec3(0, 0, 0));
        board_outline_vertices += 2;
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

    var origin_x = -1.00;
    var origin_y = -1.00;

    var side = 0.24;

    var r1 = 0.76;
    var g1 = 0.84;
    var b1 = 0.96;
    var r2 = 0.78;
    var g2 = 0.15;
    var b2 = 0.21;

    var grid_num = 8;
    
    draw_board(vertices, colors, origin_x, origin_y, side, r1, g1, b1, r2, g2, b2, grid_num);
    draw_board_outline(vertices, colors, origin_x, origin_y, side, grid_num);

    board_total = board_vertices + board_outline_vertices;

    var rc1 = 0.80;
    var gc1 = 0.16;
    var bc1 = 0.66;
    var rc2 = 0.00;
    var gc2 = 0.55;
    var bc2 = 0.00;
    draw_circles(vertices, colors, origin_x, origin_y, side, rc1, gc1, bc1, rc2, gc2, bc2, grid_num);
    draw_circles_outlines(vertices, colors, origin_x, origin_y, side, 0, 0, 0, grid_num)

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

    for (let i = 0; i < board_vertices; i += 4) {
        gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }

    for (let i = 0; i < board_outline_vertices; i += 2) {
        gl.drawArrays(gl.LINES, board_vertices + i, 2);
    }

    for (let i = 0; i < number_circles; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, board_total + i * vert_in_a_circle, vert_in_a_circle);
    }

    for (let i = 0; i < number_outline_circles; i++) {
        gl.drawArrays(gl.LINE_STRIP, board_total + number_circles * vert_in_a_circle + i * vert_in_a_circle, vert_in_a_circle);
    }
}
