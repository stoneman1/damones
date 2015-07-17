{
    data: (function() {
        var ro = {};
        ro.partname = 'cubetest';
        ro.partlength = 1500 * 100;
        ro.cameras = {
            'scenecam': new THREE.PerspectiveCamera(45, global_engine.getAspectRatio(), 0.1, 10000)
        };

        ro.scenes = {};
        ro.lights = {};
        ro.objects = {};
        ro.groups = {};
        ro.effects = {};
        ro.passes = {};
        ro.rendertargets = {};
        ro.renderpasses = {};
        ro.composers = {};
        ro.particleSystems = {};

        ro.scenes['scene'] = (function(obj) {
            var scene = new THREE.Scene();

            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var texture = new THREE.ImageUtils.loadTexture( image_lava2.src );
            var material = new THREE.MeshLambertMaterial( { map: texture } );
            var mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );
            obj.objects['cube'] = mesh;

            var sprite = THREE.ImageUtils.loadTexture( image_particlew.src );
            material = new THREE.PointCloudMaterial( { size: 0.1, sizeAttenuation: true, map: sprite, alphaTest: 0.1, transparent: true });
            material.blending = THREE[ 'AdditiveBlending' ];
            var particleCount = 5000,
                particles = new THREE.Geometry();
                for(var p = 0; p < particleCount; p++) {
                var angle1 = Math.random() * 360;
                var angle = Math.random() * 180;
                var ra = 1;
                var pX = ra * Math.cos(angle1 / 180 * Math.PI) * Math.sin(angle / 180 * Math.PI),
                    pY = ra * Math.sin(angle1 / 180 * Math.PI) * Math.sin(angle / 180 * Math.PI),
                    pZ = ra * Math.cos(angle / 180 * Math.PI),
                    particle  = new THREE.Vector3(pX, pY, pZ);

                particles.vertices.push(particle);
            }

            var particleSystem = new THREE.PointCloud(
                particles,
                material);

            particleSystem.position.y = 0;
            particleSystem.position.x = 0;
            particleSystem.position.z = 5;
            var particleSystem1 = particleSystem.clone();
            scene.add(particleSystem);
            scene.add(particleSystem1);
            obj.particleSystems['particleSystem'] = particleSystem;
            obj.particleSystems['particleSystem1'] = particleSystem1;

            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 0 );
            light.intensity = 2;
            scene.add( light );
            obj.lights['cubelight'] = light;

            var light = new THREE.DirectionalLight( 0x999999 );
            light.position.set( -1, -1, 2 );
            light.intensity = 1;
            scene.add( light );
            obj.lights['cubelight'] = light;

            scene.add(obj.cameras['scenecam']);
            obj.cameras['scenecam'].position.z = 20;

            var scenecomposer = new THREE.EffectComposer(global_engine.renderers['main'],
            new THREE.WebGLRenderTarget( global_engine.getWidth(), global_engine.getHeight(),
                { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, alpha: true, autoClear: false }
            ));

            var scenerenderpass = new THREE.RenderPass(scene, obj.cameras['scenecam']);
            scenecomposer.addPass(scenerenderpass);
            obj.composers['scenecomposer'] = scenecomposer;

        return scene;
    }(ro));

    ro.scenes['composer'] = (function(obj) {
        var maincomposer = new THREE.EffectComposer(global_engine.renderers['main'],
            new THREE.WebGLRenderTarget(global_engine.getWidth(), global_engine.getHeight(),
                { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, alpha: true, autoClear: true }
            ));

        maincomposer.addPass(new THREE.RenderPass(ro.scenes['scene'], ro.cameras['scenecam']));

        var bloompass = new THREE.BloomPass(1, 25, 5, 256);
        maincomposer.addPass(bloompass);

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
        maincomposer.addPass(effectCopy);

        obj.composers['maincomposer'] = maincomposer;

    }(ro));

        /*
        player starting...
         here you basicly render stuff and do whatever updates needed to the scene(s) on run time.
         */
    var dire = false;
        var dire1 = false;
    ro.player = function(partdata, parttick, tick) {

        this.objects['cube'].rotation.x = parttick / 1000;
        this.objects['cube'].rotation.y = parttick / 1000;
        this.objects['cube'].rotation.z = parttick / 4000;

        this.particleSystems['particleSystem'].rotation.y += 0.03;
        this.particleSystems['particleSystem'].rotation.z += 0.01;
        this.particleSystems['particleSystem1'].rotation.y += 0.03;
        this.particleSystems['particleSystem1'].rotation.z += 0.01;
        if (dire == false) {
            this.particleSystems['particleSystem'].position.x += 0.1;
            this.particleSystems['particleSystem1'].position.x += 0.1;
            if (this.particleSystems['particleSystem'].position.x >= 10) {
                dire = true;
            }
        }
        else {
            this.particleSystems['particleSystem'].position.x -= 0.1;
            this.particleSystems['particleSystem1'].position.x -= 0.1;
            if (this.particleSystems['particleSystem'].position.x <= -10) {
                dire = false;
            }
        }
        if (dire1 == false) {
            this.particleSystems['particleSystem'].position.y += 0.1;
            this.particleSystems['particleSystem1'].position.y -= 0.1;
            if (this.particleSystems['particleSystem'].position.y >= 5) {
                dire1 = true;
            }
        }
        else {
            this.particleSystems['particleSystem'].position.y -= 0.1;
            this.particleSystems['particleSystem1'].position.y += 0.1;
            if (this.particleSystems['particleSystem'].position.y <= -5) {
                dire1 = false;
            }
        }
        var dt = global_engine.clock.getDelta(); // delta time for some post processing stuff



        this.composers['maincomposer'].render(dt); //passing delta time to the renderer, because some of the post pro effects needs it.

    }

    return ro;
}())
}
