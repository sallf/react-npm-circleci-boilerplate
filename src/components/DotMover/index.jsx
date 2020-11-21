import React, { Component } from 'react';
import * as THREE from 'three';

const scene = new THREE.Scene();
const mouse = new THREE.Vector2();

let camera;
let renderer;
let width;
let height;

class DotMover extends Component {
  constructor() {
    super();
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

  componentDidMount() {
    width = this.canvasRef.clientWidth;
    height = this.canvasRef.clientHeight;

    camera = new THREE.PerspectiveCamera(
      60, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      1000, // far plane
    );

    renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef });
    renderer.setPixelRatio(width / height);
    // renderer.setSize(width, height);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      shading: THREE.SmoothShading,
    });

    const objects = [];

    for (let i = 0; i < 10; i += 1) {
      const material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        specular: 0xffffff,
        shininess: 50,
        shading: THREE.SmoothShading,
      });

      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = Math.random() * 10;
      sphere.position.y = Math.random() * 10;
      sphere.position.z = Math.random() * 10;

      sphere.castShadow = true;
      sphere.receiveShadow = true;

      scene.add(sphere);
    }

    // camera.position.x = 1;
    // camera.position.y = 1;
    camera.position.z = 30;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  }

  rend = () => {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i += 1) {
      intersects[i].object.material.color.set(0xff0000);

      // pick the first object. It's the closest one
      this.pickedObject = intersects[0].object;
    }

    if (this.pickedObject) {
      console.log('ll', mouse);
      this.pickedObject.position.x = mouse.x;
      this.pickedObject.position.y = mouse.y;
    }

    renderer.render(scene, camera);
  };

  handleMouseMove = (evt) => {
    mouse.x = (evt.clientX / width) * 2 - 1;
    mouse.y = -(evt.clientY / height) * 2 + 1;

    this.rend();
  };

  render() {
    return (
      <div>
        <canvas
          ref={elem => this.canvasRef = elem}
          style={{ width: '75%', height: '50vh', display: 'block' }}
          onMouseMove={this.handleMouseMove}
        />
      </div>
    );
  }
};

DotMover.defaultProps = {

};

DotMover.propTypes = {

};

export default DotMover;
