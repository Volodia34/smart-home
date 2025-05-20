import * as _THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import { SmartDevice, SmartDeviceStatus } from '../components/DeviceControls/DeviceControls';


export class ThreeScene {
    private scene: _THREE.Scene;
    private camera: _THREE.PerspectiveCamera;
    private renderer: _THREE.WebGLRenderer;
    private controls: OrbitControls;
    private interactiveObjects: { [key: string]: _THREE.Mesh } = {};
    private originalMaterials: Map<string, _THREE.Material> = new Map();
    private deviceDefinitions: SmartDevice[];

    constructor(private container: HTMLElement, devicesConfig: SmartDevice[]) {
        this.deviceDefinitions = devicesConfig;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.scene = new _THREE.Scene();
        this.scene.background = null;


        this.camera = new _THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(2.5, 6, 3.5);

        this.renderer = new _THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = _THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = _THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 25;
        this.controls.update();
        this.controls.minDistance = 0.1;
        this.controls.maxDistance = 100;
        this.controls.zoomSpeed = 2.0;


        this.addLights();
        this.loadHouseModel();
        this.createPrimitiveDevices();

        this.animate();

        document.addEventListener('deviceUpdate', this.handleDeviceUpdate);
        window.addEventListener('resize', this.onWindowResize);
    }

    private onWindowResize = () => {
        if (!this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private addLights(): void {
        const directionalLight = new _THREE.DirectionalLight(0xffffff, 1.2); //
        directionalLight.position.set(15, 25, 15); //
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);

        const ambientLight = new _THREE.AmbientLight(0xffffff, 0.8); //
        this.scene.add(ambientLight);
    }

    private loadHouseModel(): void {
        const loader = new GLTFLoader();
        loader.load('/assets/house.glb', (gltf) => { //
            const model = gltf.scene;
            model.position.set(0, -1.5, 0);
            model.scale.set(0.8, 0.8, 0.8);

            model.traverse((child) => {
                if (child instanceof _THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.scene.add(model);

            this.controls.update();
        }, undefined, (error) => {
            console.error('🚨 Error loading house model:', error);
        });
    }

    private createPrimitiveDevices(): void {
        this.deviceDefinitions.forEach(device => {
            let geometry: _THREE.BufferGeometry;
            let material = new _THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.1 });
            let deviceMesh: _THREE.Mesh;

            switch (device.type) {
                case 'light':
                    geometry = new _THREE.SphereGeometry(0.12, 16, 16);
                    material = new _THREE.MeshStandardMaterial({ color: 0x888888, emissive: 0x000000, roughness: 0.8 });
                    break;
                case 'tv':
                    geometry = new _THREE.BoxGeometry(0.7, 0.4, 0.04);
                    material = new _THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2, metalness: 0.2 });
                    break;
                case 'thermostat':
                    geometry = new _THREE.BoxGeometry(0.1, 0.15, 0.03);
                    material = new _THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3 });
                    break;
                case 'fan':
                    geometry = new _THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
                    material = new _THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.4 });
                    break;
                default:
                    geometry = new _THREE.BoxGeometry(0.2, 0.2, 0.2);
                    break;
            }

            deviceMesh = new _THREE.Mesh(geometry, material);
            deviceMesh.name = device.id;
            deviceMesh.castShadow = true;
            deviceMesh.receiveShadow = true;

            if (device.position3D) {
                deviceMesh.position.set(device.position3D.x, device.position3D.y, device.position3D.z);
            } else {
                deviceMesh.position.set(Math.random() * 3 - 1.5, 0.5 + Math.random() * 0.5, Math.random() * 3 - 1.5);
            }

            this.originalMaterials.set(device.id, material.clone());
            this.interactiveObjects[device.id] = deviceMesh;
            this.scene.add(deviceMesh);

            this.updateObjectAppearance(deviceMesh, device.status, device.type);
        });
    }

    private handleDeviceUpdate = (event: Event) => {
        const customEvent = event as CustomEvent<Partial<SmartDevice> & { id: string }>;
        const { id, status, type } = customEvent.detail;

        if (!id) {
            console.warn('3D Scene: Received deviceUpdate event without ID.');
            return;
        }
        const objectToUpdate = this.interactiveObjects[id];

        if (objectToUpdate) {
            if (type && status !== undefined) {
                this.updateObjectAppearance(objectToUpdate, status, type);
            } else {
                console.warn(`3D Scene: Missing type or status for device ${id}. Status: ${status}, Type: ${type}`);
            }
        } else {
            console.warn(`3D Scene: Object with ID '${id}' not found.`);
        }
    }

    private updateObjectAppearance(object: _THREE.Mesh, status: SmartDeviceStatus, type: SmartDevice['type']) {
        const currentMaterial = object.material as _THREE.MeshStandardMaterial;
        let originalMaterial = this.originalMaterials.get(object.name) as _THREE.MeshStandardMaterial;

        if (!originalMaterial) {
            console.warn(`No original material found for ${object.name}, cloning current.`);
            originalMaterial = currentMaterial.clone();
            this.originalMaterials.set(object.name, originalMaterial);
        }

        const newMaterial = originalMaterial.clone();

        switch (type) {
            case 'light':
                if (status === 'on') {
                    newMaterial.emissive.setHex(0xffffaa);
                    newMaterial.color.setHex(0xffffff);
                    newMaterial.emissiveIntensity = 2.5;
                    newMaterial.toneMapped = false;
                } else {
                    newMaterial.emissive.setHex(0x000000);
                    newMaterial.emissiveIntensity = 0;
                }
                break;

            case 'tv':
                if (status === 'on') {
                    newMaterial.color.setHex(0x050515);
                    newMaterial.emissive.setHex(0x5588ff);
                    newMaterial.emissiveIntensity = 0.7;
                } else {
                    newMaterial.emissive.setHex(0x000000);
                    newMaterial.emissiveIntensity = 0;
                }
                break;

            case 'thermostat':
                if (typeof status === 'number' && status > 0) {
                    newMaterial.color.setHex(0x66ccff);
                    newMaterial.emissive.setHex(0x336699);
                    newMaterial.emissiveIntensity = 0.2;
                } else {
                    newMaterial.emissive.setHex(0x000000);
                    newMaterial.emissiveIntensity = 0;
                }
                break;

            case 'fan':
                if (status === 'on') {
                    newMaterial.color.setHex(0xbbbbbb);
                }
                break;

            default:
                if (status === 'on' || status === 'unlocked' || status === 'brewing') {
                    newMaterial.emissive.setHex(0x00cc66);
                    newMaterial.emissiveIntensity = 0.4;
                } else {
                    newMaterial.emissive.setHex(0x000000);
                    newMaterial.emissiveIntensity = 0;
                }
                break;
        }
        object.material = newMaterial;
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);
        this.controls.update(); //
        this.renderer.render(this.scene, this.camera); //
    };

    public dispose(): void {
        document.removeEventListener('deviceUpdate', this.handleDeviceUpdate);
        window.removeEventListener('resize', this.onWindowResize);

        this.scene.traverse(object => {
            if (object instanceof _THREE.Mesh) {
                if (object.geometry) object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else if (object.material) {
                    object.material.dispose();
                }
            }
        });
        this.originalMaterials.forEach(material => material.dispose());
        this.originalMaterials.clear();

        this.renderer.dispose();
        if (this.container && this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}
