import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';

export class ThreeScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;

    constructor(private container: HTMLElement) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(1.8, 5.3, 2.2);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.4, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        this.controls.update();

        this.addLights();
        this.loadModel();
        this.animate();
    }

    private addLights(): void {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
    }

    private loadModel(): void {
        const loader = new GLTFLoader();
        loader.load('/src/assets/house.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, -1.5, 0);
            model.scale.set(0.8, 0.8, 0.8);

            this.scene.add(model);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            this.controls.target.copy(center);
            this.controls.update();
        }, undefined, (error) => {
            console.error('🚨 Error loading model:', error);
        });
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };
}
