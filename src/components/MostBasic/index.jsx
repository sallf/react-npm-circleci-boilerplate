import React, { Component } from 'react';
import * as THREE from 'three';

class Boxes extends Component {
  constructor(props) {
    super(props);

    // Canvas
    this.canvas = null;
    this.ctx = null;

    // SCENE
    this.scene = new THREE.Scene();

    // CAMERA
    this.camera = null;

    // RENDERER
    this.width = 100;
    this.height = 100;
    this.renderer = null;

    // Mesh stuff
    this.cubes = [];

    // Event listeners
    // window.addEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    // this.ctx = this.canvas.getContext('2d');

    this.setupCamera();
    this.setupRenderer();

    this.setupCubes();
    this.setupLights();
    this.loop();
  }

  componentWillUnmount() {
    // window.cancelAnimationFrame(animationFrameId);
  }

  handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setupCamera = () => {
    // https://observablehq.com/@grantcuster/understanding-scale-and-the-three-js-perspective-camera
    this.camera = new THREE.PerspectiveCamera(
      75, // fov — Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50. 10 is like a 2000mm lens | 140 is like a 20mm lense
      this.width / this.height, // aspect — Camera frustum aspect ratio. Default is 1 (square).
      0.1, // near — Camera frustum near plane. Default is 0.1. Valid range is greater than 0 and less than the current value of the far plane. There is also a z-position that can be set which is different from "near". Near is relative to z-position.
      1000, // far — Camera frustum far plane. Default is 2000. Must be greater than near.
    );
    this.camera.position.z = 10;
  }

  setupRenderer = () => {
    // Create a renderer with Antialiasing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    // Configure renderer clear color
    this.renderer.setClearColor('#000000');

    // Configure renderer size
    this.renderer.setSize(this.width, this.height);
  }

  setupCubes = () => {
    // Materials need geometry, material and mesch
    const geometry = new THREE.BoxGeometry(
      1, // width
      1, // height
      1, // depth
      1, // OPTIONAL widthSegments. Number of segmented rectangular faces along the width of the sides. Default 1;
      1, // OPTIONAL heightSegments. Number of segmented rectangular faces along the height of the sides. Default 1;
      1, // OPTIONAL depthSegments. Number of segmented rectangular faces along the depth of the sides. Default 1;
    );
    // MeshBasicMaterial || MeshPhongMaterial
    const material = new THREE.MeshPhongMaterial(
      {
        color: '#433F81',
      },
    );
    for (let i = 0; i < 10; i += 1) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(i, i * 2, 0);
      this.scene.add(cube);
      this.cubes.push(cube);
    }
  }

  setupLights = () => {
    const ambientLight = new THREE.AmbientLight(0x777777);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xbbbbbb);
    spotLight.position.set(0, 10, 100);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
  }

  loop = () => {
    this.cubes.forEach((cube, index) => {
      this.cubes[index].rotation.x += 0.01;
      this.cubes[index].rotation.y += 0.01;
    });

    this.renderer.render(this.scene, this.camera);
    console.log('loop');
    requestAnimationFrame(this.loop);
  }

  render() {
    return (
      <div>
        <canvas
          ref={(elem) => this.canvas = elem}
          style={{ width: '75%', height: '50vh', display: 'block' }}
        />
      </div>
    );
  }
}

Boxes.defaultProps = {

};

Boxes.propTypes = {

};

export default Boxes;
