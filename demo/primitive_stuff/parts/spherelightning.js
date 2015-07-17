{
    data: (function() {
        var ro = {};
        ro.partname = 'cubefader';
        ro.partlength = 1500 * 100;
        ro.cameras = {
            'scenecam': new THREE.PerspectiveCamera(45, global_engine.getAspectRatio(), 0.1, 10000),
            'bloomcam': new THREE.PerspectiveCamera(45, global_engine.getAspectRatio(), 0.1, 10000)
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

        sphereCount = 12;

        ro.scenes['scene'] = (function(obj) {
            var scene = new THREE.Scene();

            var sphereGroup = new THREE.Object3D();

            var geometry = new THREE.SphereGeometry( 2, 32, 32 );
            var texture = new THREE.ImageUtils.loadTexture ( image_lava2.src );

            for (var i = 0; i < sphereCount; i++) {
                var material = new THREE.MeshPhongMaterial( { map: texture, color: 0xff0000, shininess: 5 } );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.sin(i * Math.PI / (sphereCount/2)) * 4;
            mesh.position.y = Math.cos(i * Math.PI / (sphereCount/2)) * 4;
            obj.objects['sphere'+i] = mesh;
            sphereGroup.add( mesh );
        }
        scene.add( sphereGroup );
        obj.groups['spheregroup'] = sphereGroup;

        var light = new THREE.AmbientLight ( 0xffffff );
        scene.add( light );
        obj.lights['alight'] = light;

        var light = new THREE.PointLight ( 0xffffff );
// 			scene.add( light );
        obj.lights['plight'];

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

    ro.player = function(partdata, parttick, tick) {

        this.groups['spheregroup'].rotation.z = parttick / 2000;
        this.groups['spheregroup'].rotation.y = Math.sin(parttick / 2000);
        this.groups['spheregroup'].rotation.x = parttick / 1000;


        for (var i = 0; i < sphereCount; i++) {
            var speed = 50;
            var sphereLight = Math.round(parttick / speed);
            if (sphereLight >= sphereCount) { sphereLight -= sphereCount * Math.floor(sphereLight / sphereCount) }
            if (i == sphereLight) {
                this.objects['sphere'+i].material.color = new THREE.Color( 3, 0, 0 );
            } else {
                this.objects['sphere'+i].material.color = new THREE.Color( 1, 0, 0 );
            }
        }

        var dt = global_engine.clock.getDelta();

        this.composers['maincomposer'].render(dt);

    }

    return ro;
}())
}
