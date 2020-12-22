var Bird = function () {
  var height = 400, width = 400, depth = 400, maxSpeed = 3;
  var xMin = -width, yMin = -height, zMin = -depth, xMax = width, yMax = height, zMax = depth;

  this.velocity     = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();
  this.geometry     = new THREE.ConeGeometry(4, 8, 8);
  this.material     = new THREE.MeshBasicMaterial({ color: Math.random()* 0xff0000 });
  this.mesh         = new THREE.Mesh(this.geometry, this.material);
  this.maxSpeed     = 4;  
  // rotate geometry so cone points in .lookAt() direction
  this.geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );

  
  // rule 1 : alignment, Boids try to match velocity with near boids
  this.align = function(birds) {

    var steering = new THREE.Vector3(),  
    count =0,
    distance, currentBird;         

    for ( var i = 0, il = birds.length; i < il; i ++ ) {

      currentBird = birds[i];          
      distance = currentBird.mesh.position.distanceTo(this.mesh.position);

      if ( distance > 0 && distance <= 50 ) {

        steering.add( currentBird.velocity );
        count++;
      }          
    }

    if ( count > 0 ) {

      steering.divideScalar( count );     

    }   
                     
    steering.subVectors(steering, this.velocity);
    steering.divideScalar(8);    
    
    return steering;
  }


  // rule 2 : cohesion, Boids try to fly towards the centre of mass of neighbouring boids.
  this.cohesion = function(birds) {

    var steering = new THREE.Vector3(),
    positionAvg = new THREE.Vector3(),
    count = 0, currentBird, distance;        

    for ( var i = 0, il = birds.length; i < il; i ++ ){

      currentBird = birds[i];
      distance = currentBird.mesh.position.distanceTo(this.mesh.position);
      if ( distance > 0 && distance <= 50 ) {

        positionAvg.add( currentBird.mesh.position );
        count++;
      }                    
      
    }

    if ( count > 0 ) {

      positionAvg.divideScalar( count );

    }

    steering = positionAvg.sub(this.mesh.position);
    steering = steering.divideScalar(100);    
    
    return steering;
  }


  // rule 3 : separation, Boids try to keep a small distance away from other objects (including other boids).
  this.separation = function(birds) {

    var steering = new THREE.Vector3(),
    diff = new THREE.Vector3(),
    distance, currentBird;

    for ( var i = 0, il = birds.length; i < il; i ++ ) {

      currentBird = birds[i];

      distance = currentBird.mesh.position.distanceTo(this.mesh.position);
      if( distance > 0 && distance <= 40 ) {

        diff.subVectors(this.mesh.position, currentBird.mesh.position);
        diff.normalize();
        diff.divideScalar(distance);              
        steering.add(diff);        
      }          
    };

    
    return steering;      
  }


  // Bounding the position
  this.avoidWalls = function() {

    var v = new THREE.Vector3();

    if (this.mesh.position.x < -350 ) {
      v.x = 10;
    } else if (this.mesh.position.x > 350  ) {
      v.x = -10;
    }

    if (this.mesh.position.y < -300 ) {
      v.y = 10;
    } else if (this.mesh.position.y > 300 ) {
      v.y = -10;
    }

    if (this.mesh.position.z < -300 ) {
      v.z = 10;
    } else if (this.mesh.position.z > 300 ) {
      v.z = -10;
    }
    return v;
  }


  // Limiting the speed
  this.limitBirdVelocity = function() {
        
    if (Math.abs(this.velocity.x) > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / Math.abs(this.velocity.x)) *this. maxSpeed
    }
    if (Math.abs(this.velocity.y) > this.maxSpeed) {
      this.velocity.y = (this.velocity.y / Math.abs(this.velocity.y)) * this.maxSpeed
    }
    if (Math.abs(this.velocity.z) > this.maxSpeed) {
      this.velocity.z = (this.velocity.z / Math.abs(this.velocity.z)) * this.maxSpeed
    }
  }

  
  // avoid hinderence
  this.avoidBlocks = function( blocks ){
    var steering = new THREE.Vector3();
    var xzBird = new THREE.Vector2( this.mesh.position.x, this.mesh.position.z );
    for (var i = 0, il = blocks.length; i < il; i++) {

      xzBlock = new THREE.Vector2( blocks[i].mesh.position.x, blocks[i].mesh.position.z );
      distance = xzBlock.distanceTo( xzBird ); 

      if ( (distance > 0) && ( distance < 50 ) ) {

        var diff = new THREE.Vector2();
        diff.subVectors(xzBird, xzBlock);
        diff.divideScalar(distance);
        diff.normalize();
        var p = new THREE.Vector3( diff.x, 0, diff.y );
        steering = steering.add(p);

      }
    }
    return steering;
  }


  // combining all the rules and add to the boid.velocity
  this.moveBird = function(birds, blocks) {   

      this.velocity.add( this.align(birds) );
      this.velocity.add( this.cohesion(birds) );
      this.velocity.add( this.separation(birds) );
      this.velocity.add( this.avoidWalls() );
      this.velocity.add( this.avoidBlocks(blocks) );
      
      this.limitBirdVelocity();      
      
      var target = new THREE.Vector3();    
      target.addVectors(this.velocity, this.mesh.position);
      this.mesh.lookAt(target);

      this.mesh.position.addVectors(this.mesh.position, this.velocity);    
  }  

};




