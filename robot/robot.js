Robot = function(x,y,z) {
	//default constructor

	// ROBOT GOES HERE!
	this.head = new THREE.Bone();
	this.head.position.x = x; // world cordinates
	this.head.position.y = y;
	this.head.position.z = z;

	this.neck = new THREE.Bone();
	this.neck.position.y = -10;
	this.head.add(this.neck);

	this.torso = new THREE.Bone();
	this.torso.position.y = -30;
	this.neck.add(this.torso);

	// left arm
	this.left_upper_arm = new THREE.Bone();
	this.left_upper_arm.position.y = -5;
	this.left_upper_arm.position.x = 5;
	this.neck.add(this.left_upper_arm);

	this.left_lower_arm = new THREE.Bone();
	this.left_lower_arm.position.y = -15;
	this.left_lower_arm.position.x = 5;
	this.left_upper_arm.add(this.left_lower_arm);

	this.left_hand = new THREE.Bone();
	this.left_hand.position.y = -5
	this.left_hand.position.x = 5
	this.left_lower_arm.add(this.left_hand);

	// right arm
	this.right_upper_arm = new THREE.Bone();
	this.right_upper_arm.position.y = -5;
	this.right_upper_arm.position.x = -5;
	this.neck.add(this.right_upper_arm);

	this.right_lower_arm = new THREE.Bone();
	this.right_lower_arm.position.y = -15;
	this.right_lower_arm.position.x = -5;
	this.right_upper_arm.add(this.right_lower_arm);

	this.right_hand = new THREE.Bone();
	this.right_hand.position.y = -5
	this.right_hand.position.x = -5
	this.right_lower_arm.add(this.right_hand);

	// left leg
	this.left_upper_leg = new THREE.Bone();
	this.left_upper_leg.position.y = -15;
	this.left_upper_leg.position.x = 5;
	this.torso.add(this.left_upper_leg);

	this.left_lower_leg = new THREE.Bone();
	this.left_lower_leg.position.y = -10;
	this.left_lower_leg.position.x = 3;
	this.left_upper_leg.add(this.left_lower_leg);

	this.left_foot = new THREE.Bone();
	this.left_foot.position.y = -5;
	this.left_foot.position.x = 5;
	this.left_lower_leg.add(this.left_foot);

	// right leg
	this.right_upper_leg = new THREE.Bone();
	this.right_upper_leg.position.y = -15;
	this.right_upper_leg.position.x = -5;
	this.torso.add(this.right_upper_leg);

	this.right_lower_leg = new THREE.Bone();
	this.right_lower_leg.position.y = -10;
	this.right_lower_leg.position.x = -3;
	this.right_upper_leg.add(this.right_lower_leg);

	this.right_foot = new THREE.Bone();
	this.right_foot.position.y = -5;
	this.right_foot.position.x = -5;
	this.right_lower_leg.add(this.right_foot);

};


Robot.prototype.raise_left_arm = function() {
  this.movement = 'raise left arm';
};

Robot.prototype.lower_left_arm = function() {
  this.movement = 'lower left arm';
};

Robot.prototype.kick = function() {
  this.movement = 'kick';
};

Robot.prototype.dance = function() {
  this.movement = 'dance';
};



Robot.prototype.show = function(scene) {

	// // create group and point to the robot head
    var rGroup = new THREE.Group();
    rGroup.add(this.head);    

    // // use the skeleton helper to visualize the skeleton
    var helper = new THREE.SkeletonHelper( rGroup );
    helper.material.linewidth = 3;   //make the skeleton thick
    
    scene.add( rGroup );
    scene.add( helper );

	// no movement by default
	this.movement = '';
};

Robot.prototype.onAnimate = function() {

  if (this.movement == 'raise left arm') {

    var T = -Math.PI;   //180 degree
    this.left_upper_arm.quaternion.slerp( new THREE.Quaternion(Math.sin(T/2),   // x
                                                              0,               // y
                                                              0,               // z
                                                              Math.cos(T/2)),  // w
                                        0.1 );

  } else if(this.movement == 'lower left arm') {

  	this.left_upper_arm.quaternion.slerp( new THREE.Quaternion(0,0,0,1), 0.1 );

  }  else if (this.movement == 'kick') {  	

    // check if slerp reached almost the end
    if (this.right_upper_leg.quaternion.w < 0.72) {

      // signal that the kick is done and the leg should move back
      this.movement = 'kick done';

    } else {

      var T = -Math.PI/2;
      this.right_upper_leg.quaternion.slerp( new THREE.Quaternion( Math.sin( T / 2 ),   // x
                                                                  0,                   // y
                                                                  0,                   // z
                                                                  Math.cos( T / 2 ) ), // w
                                            0.1 );
                                      
    }
    // this was working when I tried but later don't know what went wrong :( :(
    /*var T = -Math.PI/2;
    this.right_upper_leg.quaternion.slerp( new THREE.Quaternion( Math.sin( T / 2 ),   // x
                                                                  0,                   // y
                                                                  0,                   // z
                                                                  Math.cos( T / 2 ) ), // w
                                        0.1 );

    this.movement = 'kick done';*/

  } else if (this.movement == 'kick done') {

    // reset leg back to identity
    this.right_upper_leg.quaternion.slerp( new THREE.Quaternion(0,0,0,1), 0.1 );

  } else if (this.movement == 'dance'){
  	
  	if (this.right_upper_leg.quaternion.w < 0.72 ){

  		this.movement = 'dance stop';
  		
  	}else {

  		x_direction = new THREE.Quaternion( Math.sin( T / 2 ), 0, 0, Math.cos( T / 2 ) );	  	

	  	this.left_upper_arm.quaternion.slerp(x_direction, 0.1);	  	
	  	this.right_lower_arm.quaternion.slerp(x_direction, 0.1);	  	
	  	this.right_upper_leg.quaternion.slerp(x_direction, 0.1);
	  	this.left_upper_leg.quaternion.slerp(x_direction, 0.1);

  	}
  	
  } else if ( this.movement == 'dance stop'){

	identity = new THREE.Quaternion(0,0,0,1);
  	this.left_upper_arm.quaternion.slerp(identity, 0.1);
  	this.right_lower_arm.quaternion.slerp(identity, 0.1);  	
  	this.right_upper_leg.quaternion.slerp(identity, 0.1);
  	this.left_upper_leg.quaternion.slerp(identity, 0.1);
  	} 	

  
};


