window.onload=(function() {
    var canvas = document.querySelector('canvas');
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    // set height and width of canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // setup canvas center 
    var centerWidth = canvas.width / 2;
    var centerHeight = canvas.height / 2;

    // setup variables
    var c = canvas.getContext("2d");

    // setup coordinates and classes for icon
    var icon_size = 50
    var spacer = 1
    if (canvasWidth > 1200) {
        icon_size = 100;
        spacer = 2
    }
    var icons = {
        key: ["key-light-icon",centerWidth - 100 * spacer,centerHeight + 100 * spacer,icon_size,icon_size],
        fill: ["fill-light-icon",centerWidth + 200 * spacer,centerHeight + 75 * spacer,icon_size,icon_size],
        back: ["back-light-icon",centerWidth + 50 * spacer,centerHeight - 150 * spacer,icon_size,icon_size],
        person: ["person-icon",centerWidth + 50 * spacer, centerHeight - 25 * spacer,icon_size,icon_size],
    };

    // setup image classes
    var image_classes = [
        "all_lights_portrait",
        "no_back_lights_portrait",
        "no_fill_lights_portrait",
        "no_key_lights_portrait",
        "no_light_lights_portrait",
        "only_back_lights_portrait",
        "only_fill_lights_portrait",
        "only_key_lights_portrait",
    ];

    // draw lines for the lights
    var key_light = {
        path: [],
        isVisible: false,
    }
    var fill_light = {
        path: [],
        isVisible: false,
    }
    var back_light = {
        path: [],
        isVisible: false,
    }
    // draw icons and setup draw lines
    var curr_icon = "";
    var curr_x = 0;
    var curr_y = 0;
    var curr_height = 0;
    var curr_width = 0;
    var px_center = icons[Object.keys(icons)[3]][1] + 25
    var py_center = icons[Object.keys(icons)[3]][2] + 25
    function drawIcons() {
        for(var i=0;i<Object.keys(icons).length;i++) {
            var curr_class = document.getElementById(icons[Object.keys(icons)[i]][0]);
            curr_x = icons[Object.keys(icons)[i]][1];
            curr_y = icons[Object.keys(icons)[i]][2];
            curr_height = icons[Object.keys(icons)[i]][3];
            curr_width = icons[Object.keys(icons)[i]][4];
            c.drawImage(curr_class,curr_x,curr_y,curr_height,curr_width);
            
            // setup lines
            if (icons[Object.keys(icons)[i]][0] === "key-light-icon") {
                key_light.path = [curr_x + curr_width, curr_y,
                    px_center+curr_width,py_center+curr_height/2,
                    px_center-curr_width,py_center,
                    curr_x + curr_width,curr_y];
            } else if (icons[Object.keys(icons)[i]][0] === "fill-light-icon") {
                fill_light.path = [curr_x, curr_y,
                    px_center+curr_width*2,py_center-curr_height/2,
                    px_center-curr_width,py_center+curr_height,
                    curr_x, curr_y ];
            } else if (icons[Object.keys(icons)[i]][0] === "back-light-icon") {
                back_light.path = [curr_x + curr_width/2 - 5, curr_y + curr_height,
                    px_center+curr_width,py_center+curr_height/2,
                    px_center-curr_width,py_center,
                    curr_y + curr_height];
            }
        }
    }
    drawIcons();
    function drawPortrait() {
        // write text
        c.font = "50px Helvetica";
        c.fillStyle = "#FFEB5B"
        c.fillText("3 Point Lighting", 50, canvasHeight/4);
        
        c.font = "16px Helvetica";
        c.fillStyle = "#7D7D7D";
        c.fillText("Source: https://www.mediacollege.com/lighting/three-point/",50, canvasHeight -50)
        var image_size = [50,centerHeight - (100*spacer),200*spacer,150*spacer];
        x = 0;
        if (key_light.isVisible && fill_light.isVisible && back_light.isVisible) {
            x = 0;
        } else if (key_light.isVisible && fill_light.isVisible && !back_light.isVisible) {
            x = 1;
        } else if (key_light.isVisible && !fill_light.isVisible && back_light.isVisible) {
            x = 2;
        } else if (!key_light.isVisible && fill_light.isVisible && back_light.isVisible) {
            x = 3;
        } else if (!key_light.isVisible && !fill_light.isVisible && !back_light.isVisible) {
            x = 4;
        } else if (!key_light.isVisible && !fill_light.isVisible && back_light.isVisible) {
            x = 5;
        } else if (!key_light.isVisible && fill_light.isVisible && !back_light.isVisible) {
            x = 6;
        } else if (key_light.isVisible && !fill_light.isVisible && !back_light.isVisible) {
            x = 7;
        }
        c.drawImage(document.getElementById(image_classes[x]),image_size[0],image_size[1],image_size[2],image_size[3])
    }
    drawPortrait();
    function drawLight(curr_light) {
        var grd_x1;
        var grd_x2 = px_center;
        var grd_y1;
        var grd_y2 = py_center;
        c.beginPath();
        for ( i=0;i <= curr_light.length;i++) {
            if (i % 2 == 0) {
                curr_x = curr_light[i];
            }
            else {
                curr_y = curr_light[i];
            }
            if (i==1) {
                c.moveTo(curr_x, curr_y);
                
            } else if (i % 2 == 1) {
                curr_y = curr_light[i];
                c.lineTo(curr_x, curr_y);
            }
            
        }
        // line colors
        var grd = c.createLinearGradient(0,px_center/1.5,0,py_center/1.5);
        grd.addColorStop(0, "#FFEB5B");
        // use rgba to add transparency

        grd.addColorStop(1, "rgba(252, 245, 207, 0.0)");
        if (canvasWidth >  900) {
            c.fillStyle = grd;
        }
        else {
            c.fillStyle = "#FFEB5B"
        }
        c.fill();
    }

    // helper function to get an element's exact position
    function getMousePosition(canvas, event) { 
        let rect = canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left; 
        let y = event.clientY - rect.top; 
        return ([x,y]);
    } 

    // change the mouse cursor if function is hovering
    function isHovering(mouse) {
        var cursorHover = false;
        for(var i=0;i<Object.keys(icons).length;i++) {
            curr_x = icons[Object.keys(icons)[i]][1];
            curr_y = icons[Object.keys(icons)[i]][2];
            curr_height = icons[Object.keys(icons)[i]][3];
            curr_width = icons[Object.keys(icons)[i]][4];
            if (!cursorHover) {
                if (mouse[0] < curr_x + curr_width && mouse[0] > curr_x - curr_width) {
                    if (mouse[1] < curr_y + curr_height && mouse[1] > curr_y - curr_height) {
                        cursorHover = true;
                    }
                    else {
                        cursorHover = false;
                        canvas.style.cursor = "default";
                    }
                }
                else {
                    cursorHover = false;
                    canvas.style.cursor = "default";
                }
            }
            else {
                canvas.style.cursor = "pointer"
            }
        }
    }
    // function to check if an object is selected after click
    function isClicked(mouse) {
        for(var i=0;i<Object.keys(icons).length;i++) {
            curr_x = icons[Object.keys(icons)[i]][1];
            curr_y = icons[Object.keys(icons)[i]][2];
            curr_height = icons[Object.keys(icons)[i]][3];
            curr_width = icons[Object.keys(icons)[i]][4];
            if (mouse[0] < curr_x + curr_width && mouse[0] > curr_x - curr_width) {
                if (mouse[1] < curr_y + curr_height && mouse[1] > curr_y - curr_height) {
                    return (icons[Object.keys(icons)[i]][0]);
                }
            }
            else {
            }
        }
        return false;
    }
    canvas.addEventListener("mousemove", function(e)
    {
        mouse = getMousePosition(canvas, e);
        isHovering(mouse)
    });

    // when you click down on the mouse
    canvas.addEventListener("mousedown", function(e) 
    { 
        mouse = getMousePosition(canvas, e);
        iconClick = isClicked(mouse);
        if (iconClick != false) {
            if (iconClick == "key-light-icon") {
                if (key_light.isVisible) {
                    key_light.isVisible = false;
                } else {
                    key_light.isVisible = true;
                }
                
            }
            if (iconClick == "fill-light-icon") {
                if (fill_light.isVisible) {
                    fill_light.isVisible = false;
                } else {
                    fill_light.isVisible = true;
                }
            }
            if (iconClick == "back-light-icon") {
                if (back_light.isVisible) {
                    back_light.isVisible = false;
                } else {
                    back_light.isVisible = true;
                }
            }
        }
        c.clearRect(0,0,canvasWidth,canvasHeight);
        drawIcons();
        for (i=0;i < 3;i++) {
            if (key_light.isVisible) {
                drawLight(key_light.path);
            }
            if (fill_light.isVisible) {
                drawLight(fill_light.path);
            }
            if (back_light.isVisible) {
                drawLight(back_light.path);
            }
        }
        drawPortrait();
    }); 
});
