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

        ro.scenes['scene'] = (function(obj) {
            var scene = new THREE.Scene();

            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var texture = new THREE.ImageUtils.loadTexture( image_lava2.src );
            var material = new THREE.MeshLambertMaterial( { map: texture } );
            var mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );
            obj.objects['cube'] = mesh;

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

    ro.player = function(partdata, parttick, tick) {

        this.objects['cube'].rotation.x = parttick / 1000;
        this.objects['cube'].rotation.y = parttick / 1000;
        this.objects['cube'].rotation.z = parttick / 4000;

        var dt = global_engine.clock.getDelta(); // delta time for some post processing stuff



        this.composers['maincomposer'].render(dt); //passing delta time to the renderer, because some of the post pro effects needs it.

    }

    return ro;
}())
}
