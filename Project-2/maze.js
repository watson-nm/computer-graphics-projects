// Nola Watson
// CSC 350
// Project 2

"use strict";

var thetaLoc;
var theta = 0;
var dir = 0; // -1 = left turn, 1 = right turn
var mov = 0;
var gl;
var maze_vert_num = 0;
var vertices = [
];

var colors = [
];
var num_line_verts = 0;
var wallr = 0;
var wallg = 0;
var wallb = 0;
var rat_verts = 0;
var rat_pos = vec2(0, 0);
var circle_increment = 0.01;
var circle_verts = Math.ceil((Math.PI * 2)/circle_increment);
var modelViewMatrixLoc;

var program;

var grid_num = 12; // Size of array
var squares_arr = new Array(grid_num); // Array containing wall values
var pos_grid = new Array(grid_num); // Array of coordinates in maze

function calc_walls(vertices, colors, origin_x, origin_y, side, grid_num, squares_arr) {
    var wall_type;
    var x0;
    var y0;
    for (let i = 0; i < grid_num; i++) {
        for (let j = 0; j < grid_num; j++) {
            wall_type = squares_arr[i][j];
            x0 = origin_x + side * j;
            y0 = origin_y + side * i;
            
            if (wall_type >= 8) {
                // Draw left wall
                vertices.push(vec2(x0, y0));
                colors.push(vec3(wallr, wallg, wallb));
                vertices.push(vec2(x0, y0 + side));
                colors.push(vec3(wallr, wallg, wallb));
                maze_vert_num += 2;
            }

            if ((wall_type % 8) >= 4) {
                // Draw top wall
                vertices.push(vec2(x0, y0 + side));
                colors.push(vec3(wallr, wallg, wallb));
                vertices.push(vec2(x0 + side, y0 + side));
                colors.push(vec3(wallr, wallg, wallb));
                maze_vert_num += 2;
            }

            if (((wall_type % 8) % 4) >= 2) {
                // Draw right wall
                vertices.push(vec2(x0 + side, y0));
                colors.push(vec3(wallr, wallg, wallb));
                vertices.push(vec2(x0 + side, y0 + side));
                colors.push(vec3(wallr, wallg, wallb));
                maze_vert_num += 2;
            }

            if (wall_type % 2 == 1) {
                // Draw bottom
                vertices.push(vec2(x0, y0));
                colors.push(vec3(wallr, wallg, wallb));
                vertices.push(vec2(x0 + side, y0));
                colors.push(vec3(wallr, wallg, wallb));
                maze_vert_num += 2;
            }
        }
    }
}

// Calculate grid of center positions of squares
function calc_grid(origin_x, origin_y, side, grid_num, pos_grid) {
    var x0;
    var y0;
    var offset = side / 2;

    for (let i = 0; i < grid_num; i++) {
        for (let j = 0; j < grid_num; j++) {
            x0 = origin_x + side * j + offset;
            y0 = origin_y + side * i + offset;

            pos_grid[i][j] = vec2(x0, y0);
        };
    };
}

// Function to draw a rat
function draw_rat(vertices, colors, x0, y0) {
    var rad = 0.03; // body radius
    var eye_rad = 0.01; // eye radius
    var r = 0.82; // r value
    var g = 0.57; // g value
    var b = 0.46; // b value

    rat_verts += draw_circle(vertices, colors, rad, x0, y0, r, g, b);
    rat_verts += draw_circle(vertices, colors, eye_rad, x0 - (rad / 2), y0 + rad, 0.1, 0.1, 0.1);
    rat_verts += draw_circle(vertices, colors, eye_rad, x0 + (rad / 2), y0 + rad, 0.1, 0.1, 0.1);
}

// Function to draw a circle give radius, center coordinate, and color values
function draw_circle(vertices, colors, rad, x0, y0, r, g, b) {
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

// Check to see if it is possible to move in the specified direction and return updated position
function check_legal(nsew) {
    var y = rat_pos[0];
    var x = rat_pos[1];
    var box = squares_arr[y][x];

    var new_pos = vec2(rat_pos[0], rat_pos[1]);

    if (nsew == 0) {
        // up
        if ((box % 8) < 4) {
            // increase y position
            if (y < grid_num - 1) {
                new_pos[0] += 1;
            }
        }
    }

    if (nsew == 1 || nsew == -3) {
        // left
        if (box < 8) {
            // decrease x position
            if (x > 0) {
                new_pos[1] -= 1;
            }
        }
    }

    if (nsew == 2 || nsew == -2) {
        // down
        if (box % 2 == 0) {
            // decrease y position
            if (y > 0) {
                new_pos[0] -= 1;
            }
        }
    }

    if (nsew == 3 || nsew == -1) {
        // right
        if (((box % 8) % 4) < 2) {
            // increase x position
            if (x < grid_num - 1) {
                new_pos[1] += 1;
            }
        }
    }

    return new_pos;
}

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    var origin_x = -0.8;
    var origin_y = -0.8;

    var side = (canvas.width/18)/200;

    
    for (var i = 0; i < grid_num; i++) {
        squares_arr[i] = new Array(grid_num);
    }

    for (var i = 0; i < grid_num; i++) {
        pos_grid[i] = new Array(grid_num);
    };

    // Populate array of wall values
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

    // Calculate all the walls
    calc_walls(vertices, colors, origin_x, origin_y, side, grid_num, squares_arr);

    // Calculate position grid
    calc_grid(origin_x, origin_y, side, grid_num, pos_grid);

    // Draw a rat and set inital position
    draw_rat(vertices, colors, 0, 0);
    rat_pos = vec2(8, 0);
    var ratx = (pos_grid[rat_pos[0]][rat_pos[1]])[0];
    var raty = (pos_grid[rat_pos[0]][rat_pos[1]])[1];
    vertices.push(vec2(ratx, raty));
    colors.push(vec3(1, 0, 0));
    num_line_verts += 1;

    // Configure WebGL   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );   
 
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(program);

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

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    // Event listeners
    window.onkeypress = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
            case 'j':
                dir = -1;
                break;
            case 'l':
                dir = 1;
                break;
            case 'k':
                mov = 1;
                break;
        }
    };
    
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    var ctm = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));

    for (let i = 0; i < maze_vert_num; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
    }

    // Change theta depending on key input
    var rtm = mat4();
    if (dir == -1) {
        theta += 90;
    } else if (dir == 1) {
        theta -= 90;
    }

    // If key pressed to move forward check if able to move forward and add new vertex to path
    if (mov == 1) {
        var nsew = (theta / 90) % 4;
        var new_pos = check_legal(nsew);

        if (new_pos[0] != rat_pos[0] || new_pos[1] != rat_pos[1]) {
            rat_pos[0] = new_pos[0];
            rat_pos[1] = new_pos[1];
            // Add new vertex to path
            vertices.push(vec2((pos_grid[rat_pos[0]][rat_pos[1]])[0], (pos_grid[rat_pos[0]][rat_pos[1]])[1]));
            colors.push(vec3(1, 0, 0));
            num_line_verts += 1;
            console.log(vertices);
        }
    }

    // Get x and y positions of rat
    var ratx = (pos_grid[rat_pos[0]][rat_pos[1]])[0];
    var raty = (pos_grid[rat_pos[0]][rat_pos[1]])[1];

    // Transform rat to correct position and orientation
    rtm = mult(rtm, translate(ratx, raty, 0));
    rtm = mult(rtm, rotateZ(theta));
   
    dir = 0;
    mov = 0;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(rtm));
    
    gl.drawArrays(gl.TRIANGLE_FAN, maze_vert_num, circle_verts);
    gl.drawArrays(gl.TRIANGLE_FAN, maze_vert_num + circle_verts, circle_verts);
    gl.drawArrays(gl.TRIANGLE_FAN, maze_vert_num + (circle_verts * 2), circle_verts);

    // Load data into GPU and associate out shader values with data buffers
    var ltm = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ltm));

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Draw path rat takes through maze
    for (let i = 0; i < num_line_verts; i++ ) {
        gl.drawArrays(gl.LINES, maze_vert_num + rat_verts + i, 2);
    }

    requestAnimationFrame(render);
}
