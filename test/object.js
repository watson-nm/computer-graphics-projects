var canvas;
var gl;
var NumVertices  = 0;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    object();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
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
        
    render();
}

function triangle(a, b, c)
{
    points.push(vertices[a-1]);
    colors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    points.push(vertices[b-1]);
    colors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    points.push(vertices[c-1]);
    colors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    NumVertices += 3;
    //console.log(vertices[a-1], vertices[b-1], vertices[c-1]);
}

var vertices = [];

var faces = [];

function object()
{
    var i = 0;
    var xc = (xmin + xmax)/2;
    var yc = (ymin + ymax)/2;
    var zc = (zmin + zmax)/2;
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


var render = function()
{
    var ctm = mat4();
    ctm = mult(ctm, scale(0.5, 0.5, 0.5));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimationFrame( render );
}

