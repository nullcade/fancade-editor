import * as THREE from 'three';

import { useEffect, useRef } from "react";
import React from 'react';

function MyThree() {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const aspect = window.innerWidth / window.innerHeight;
    const d = 20;
    var camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 1, 1000);
    // camera.position.set(20, 20, 20);
    // camera.rotation.order = 'YXZ';
    // camera.rotation.y = - Math.PI / 4;
    // camera.rotation.x = Math.atan(- 1 / Math.sqrt(2));

    // camera.position.set(1, 1, 1); // all components equal
    camera.lookAt(scene.position); // or the origin

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    var cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = 0.6;
    cube.rotation.y = 0.785;
    cube.rotation.z = 0;
    scene.add(cube);
    camera.position.z = 5;
    // var animate = function () {
    // requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    // };
    // animate();
  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree
