// Brain animation with Three.js for bento box
let scene, camera, renderer;
let brainMesh;
let clock = new THREE.Clock();
let qualityLevel = 0.3; // Lower quality for bento box performance

function initNeuroFMBrain() {
    // Create scene with light gray background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Create camera - adjusted for bento box size
    const container = document.getElementById('neurofm-brain-container');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // Create renderer with improved settings
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable tone mapping for better lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Much higher resolution for detailed brain folds
    const segmentCount = Math.max(64, Math.floor(256 * qualityLevel));
    const geometry = new THREE.SphereGeometry(1, segmentCount, segmentCount);

    // Store original positions for animation
    const originalPositions = new Float32Array(geometry.attributes.position.array.length);
    originalPositions.set(geometry.attributes.position.array);

    // Material for bento box
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        vertexColors: true,
        envMapIntensity: 1.2
    });

    // Create color attribute for the geometry with vibrant gradient
    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);

    // Vibrant colors (cyan, pink, yellow)
    const colorA = new THREE.Color(0x1acbcb); // Cyan
    const colorB = new THREE.Color(0xe5197e); // Pink
    const colorC = new THREE.Color(0xe6cc18); // Yellow

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = geometry.attributes.position.array[i3];
        const y = geometry.attributes.position.array[i3 + 1];
        const z = geometry.attributes.position.array[i3 + 2];

        // Create an initial color gradient based on position
        const color = new THREE.Color().copy(colorA);
        color.lerp(colorB, 0.5 + 0.5 * Math.sin(x * 3));
        color.lerp(colorC, 0.5 + 0.5 * Math.cos(y * 3));

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create brain mesh
    brainMesh = new THREE.Mesh(geometry, material);
    brainMesh.position.y = 0.3; // Move sphere up
    scene.add(brainMesh);

    // Simplified lighting for bento box
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(1, 1, 2);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffffdd, 0.7);
    rimLight.position.set(-1, -1, -1);
    scene.add(rimLight);

    // Handle window resize
    window.addEventListener('resize', onNeuroFMWindowResize);

    // Increased number of seed points for more detailed folds
    const numSeeds = Math.floor(30 + 60 * qualityLevel); // Between 30 and 90

    // Pre-calculate seed points
    const foldSeeds = [];
    for (let i = 0; i < numSeeds; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        foldSeeds.push({
            position: new THREE.Vector3(x, y, z),
            strength: 0.03 + Math.random() * 0.03,
            frequency: 6 + Math.random() * 10,
            phase: Math.random() * Math.PI * 2,
            speed: 0.1 + Math.random() * 0.3
        });
    }

    // Create a pool of Vector3 objects to avoid garbage collection
    const vectorPool = new THREE.Vector3();

    // Pre-calculate frequency values for global waves
    const waveFrequencies = {
        global: { x: 8, y: 8, z: 8 },
        secondary: { x: 7, y: 7, z: 7 }
    };

    // Simplified brain fold calculation for bento box
    function calculateBrainFolds(point, time) {
        let totalDisplacement = 0;

        vectorPool.set(point.x, point.y, point.z).normalize();
        const pos = vectorPool;

        // Limit iterations for bento box
        const seedLimit = Math.ceil(foldSeeds.length * qualityLevel);
        const seedStep = qualityLevel < 0.5 ? 2 : 1;

        for (let i = 0; i < seedLimit; i += seedStep) {
            const seed = foldSeeds[i];
            const distance = pos.distanceTo(seed.position);

            if (distance > 0.8) continue;

            const ridgePattern = Math.sin(
                seed.frequency * distance +
                seed.phase +
                time * seed.speed
            ) * Math.exp(-distance * 3);

            totalDisplacement += ridgePattern * seed.strength;
        }

        // Simplified wave calculations for bento box
        const timeFactors = {
            g1: time * 0.5,
            g2: time * 0.4,
            s1: time * 0.7,
            s2: time * 0.6
        };

        const posXY = pos.x + pos.y;
        const posYZ = pos.y + pos.z;
        const posZX = pos.z + pos.x;

        const freq = waveFrequencies;

        // Simplified waves for bento box
        const globalWaves = 0.015 * Math.sin(pos.x * freq.global.x + pos.y * freq.global.y + timeFactors.g1) *
            Math.cos(pos.z * freq.global.z + pos.x * freq.global.x + timeFactors.g2);

        const secondaryWaves = 0.018 * Math.sin(pos.y * freq.secondary.y + pos.z * freq.secondary.z + timeFactors.s1) *
            Math.cos(pos.x * freq.secondary.x + pos.y * freq.secondary.y + timeFactors.s2);

        totalDisplacement += globalWaves + secondaryWaves;

        return totalDisplacement;
    }

    // Track frame count to update less frequently
    let colorUpdateCounter = 0;
    let normalsUpdateCounter = 0;

    // Function to create smooth waves and update colors
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Update the positions for wave effect
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;

        colorUpdateCounter++;
        normalsUpdateCounter++;

        // Update colors less frequently for performance
        const updateColors = colorUpdateCounter >= (qualityLevel < 0.5 ? 3 : 1);
        if (updateColors) colorUpdateCounter = 0;

        // Use step increment to process fewer vertices
        const vertexStep = qualityLevel < 0.3 ? 3 : 1;

        for (let i = 0; i < positions.length; i += 3 * vertexStep) {
            const x = originalPositions[i];
            const y = originalPositions[i + 1];
            const z = originalPositions[i + 2];

            const point = { x, y, z };

            // Apply brain fold displacement pattern
            const displacement = calculateBrainFolds(point, time);

            // Apply displacement in the radial direction
            const scale = 1 + displacement;
            positions[i] = x * scale;
            positions[i + 1] = y * scale;
            positions[i + 2] = z * scale;

            // Update colors less frequently for optimization
            if (updateColors) {
                const i3 = i;

                // Simplified color calculation for better performance
                const t = (x + y + z) * 0.3 + time * 0.2;
                const sinT = Math.sin(t + x + displacement * 3);
                const cosT = Math.cos(t * 0.7 + y * 2.0 + displacement * 5);

                // Cheaper color interpolation
                const r = colorA.r + (colorB.r - colorA.r) * (0.5 + 0.5 * sinT) +
                    (colorC.r - colorA.r) * (0.5 + 0.5 * cosT);
                const g = colorA.g + (colorB.g - colorA.g) * (0.5 + 0.5 * sinT) +
                    (colorC.g - colorA.g) * (0.5 + 0.5 * cosT);
                const b = colorA.b + (colorB.b - colorA.b) * (0.5 + 0.5 * sinT) +
                    (colorC.b - colorA.b) * (0.5 + 0.5 * cosT);

                colors[i3] = Math.max(0, Math.min(1, r));
                colors[i3 + 1] = Math.max(0, Math.min(1, g));
                colors[i3 + 2] = Math.max(0, Math.min(1, b));
            }
        }

        // Update the geometry
        geometry.attributes.position.needsUpdate = true;

        if (updateColors) {
            geometry.attributes.color.needsUpdate = true;
        }

        // Compute normals less frequently
        if (normalsUpdateCounter >= (qualityLevel < 0.5 ? 5 : 2)) {
            geometry.computeVertexNormals();
            normalsUpdateCounter = 0;
        }

        // Rotate the brain slowly
        brainMesh.rotation.y = time * 0.1;
        brainMesh.rotation.z = time * 0.05;

        renderer.render(scene, camera);
    }

    // Start animation
    animate();
}

function onNeuroFMWindowResize() {
    const container = document.getElementById('neurofm-brain-container');
    if (!container || !camera || !renderer) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Check if THREE.js is loaded
    if (typeof THREE !== 'undefined') {
        // Small delay to ensure container is rendered
        setTimeout(() => {
            initNeuroFMBrain();
        }, 100);
    } else {
        console.error('THREE.js library not loaded.');
    }
});
