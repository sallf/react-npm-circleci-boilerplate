import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera;
let renderer;
let width;
let height;

const rend = () => {
  console.log('mse', mouse);

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  console.log('REND', intersects);

  for (let i = 0; i < intersects.length; i += 1) {
    intersects[i].object.material.color.set(0xff0000);
  }

  renderer.render(scene, camera);
};


// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const DotMover = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    // var renderer = new THREE.WebGLRenderer( { canvas: artifactCanvas } );

    // renderer.canvas = canvasRef.current;

    // canvasContainer.current.appendChild(renderer.domElement);

    width = canvasRef.current.clientWidth;
    height = canvasRef.current.clientHeight;

    camera = new THREE.PerspectiveCamera(
      60, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      1000, // far plane
    );

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
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
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // camera.position.x = 1;
    // camera.position.y = 1;
    camera.position.z = 5;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const animate = () => {
      requestAnimationFrame(animate);
      // sphere.rotation.x += 0.01;
      // sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    // animate();

    renderer.render(scene, camera);
  }, []);

  const handleMouseMove = (evt) => {
    mouse.x = (evt.clientX / width) * 2 - 1;
    mouse.y = -(evt.clientY / height) * 2 + 1;

    rend();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '75%', height: '50vh', display: 'block' }}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

DotMover.defaultProps = {

};

DotMover.propTypes = {

};

export default DotMover;
