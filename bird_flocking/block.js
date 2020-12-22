var Block = function(x, y, z) {


	this.geometry     = new THREE.SphereBufferGeometry( 5, 10, 10 );
	this.material     = new THREE.MeshBasicMaterial({ color: 0xffffff });
	this.mesh         = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set(x, y, z);
}

Block.prototype.show = function(scene) {

  scene.add( this.mesh );
  
};