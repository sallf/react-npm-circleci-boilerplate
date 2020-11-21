import React, { Component, useRef, useEffect } from 'react';
import * as THREE from 'three';

class Boxes extends Component {
  constructor(props) {
    super(props);

    // Canvas
    this.canvas = null;
    this.ctx = null;

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.width = 100;
    this.height = 100;
    this.renderer = null;


    // Camera
    const res = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(
      75,
      res,
      0.1,
      1000,
    );
    this.camera.position.z = 10;

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
    this.camera = new THREE.PerspectiveCamera(
      70, // fov = field of view
      this.width / this.height, // aspect ratio
      1, // near plane
      1000, // far plane
    );
  }

  setupRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(this.width, this.height);
  }

  setupCubes = () => {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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
