//Box Create Game

//create world function to generate the platform, Physics uses the library 
Physics(function (world) {

//creating the boundry of the world to the window size     
    var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
        ,edgeBounce
        ,renderer
        ;
//using the built in renderer with canvas and viewport is id the element uses
    renderer = Physics.renderer('canvas', {
        el: 'viewport'
    });

 //adding the renderer to the project and having it render on every step   
    world.add(renderer);
    world.on('step', function () {
        world.render();
    });

//edge-collision-detection will tell the object where it can go
    edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds
        //this is how the object reacts once it hits the edge
        ,restitution: .4
        ,cof: .8
    });


    window.addEventListener('resize', function () {

        //this resizes the renderer and keeps it updated 
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
        edgeBounce.setAABB(viewportBounds);

    }, true);

    // for constraints
    var rigidConstraints = Physics.behavior('verlet-constraints', {
        iterations: 3
    });

   

    // first three boxes fall 
    var boxes = [];
    for ( var i = 0, l = 3; i < l; ++i ){

        boxes.push( Physics.body('rectangle', {
            width: 75
            ,height: 75
            ,x: 60 * (i % 6) + renderer.width / 2 - (180)
            ,y: 60 * (i / 6 | 0) + 50
            ,restitution: 0.9
            ,angle: Math.random()
            ,styles: {
                fillStyle: '#268bd2'
                ,strokeStyle: '#155479'
            }
        }));
    }

    //adding boxes and constraint to world 
    world.add( boxes );
    world.add( rigidConstraints );

    //these are the interactions 
    var attractor = Physics.behavior('attractor', {
        order: 0,
        strength: 0.002
    });
    //poke is the same as "click" and then function so when you click boxes appear
    world.on({
        'interact:poke': function(pos,e){
        
    var boxes = [];
        boxes.push( Physics.body('rectangle', {
            width: 75   
            ,height: 75
            ,x: event.clientX //follows the x coordinate for the mouse
            ,y: event.clientY //follows the y coordinate for the mouse
            ,restitution: 1
            ,angle: Math.random() //random angle of each box
            ,styles: {
                fillStyle: '#268bd2' //background of the boxes, need to add an image
                ,strokeStyle: '#155479'
            }
        }));


    world.add( boxes );

        }

        ,'interact:release': function(){
            world.wakeUpAll();
            world.remove( attractor );
        }
    });

    // adding different interactions to the world 
    world.add([
        Physics.behavior('interactive', { el: renderer.el })
        ,Physics.behavior('constant-acceleration') //how fast the boxes go
        ,Physics.behavior('body-impulse-response') //response to collisions 
        ,Physics.behavior('body-collision-detection') //detecting collision with other objects in the body
        ,Physics.behavior('sweep-prune')
        ,edgeBounce
    ]);

    // adding a ticker timer
    Physics.util.ticker.on(function( time ) {
        world.step( time );
    });
});
