import Home from './home';
import Contact from './contact';
import barba from '@barba/core';
import GSAP from 'gsap';
import _ from '../scss/main.scss';

import * as THREE from 'three';
import {  EffectComposer, EffectPass, RenderPass , ASCIIEffect , ASCIITexture} from "postprocessing";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import dragon from '../media/models/dragonfly.glb'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Matrix from '../apps/extra/matrix.js';

var navIsTrue = undefined

class App{
    constructor(){

        navIsTrue = this.createNav();

        this.pages = {
            home : new Home(),
            contact : new Contact(),
            effects:{
                matrix : new Matrix()
            }
        }
        this.screen ={
            width : window.innerWidth,
            height: window.innerHeight

        }

        this.createAjaxNavigation()
        this.createReRender()
        this.createScene()
        this.createCamera()
        this.createRenderer()
        this.createLights()
        this.createAASCIIEffect()
        this.createGeometry()
        this.update()
        this.addEventListeners()
    }
    createAjaxNavigation(){

        const easeIn = (container,done)=> {
            return GSAP.to(container, {
                autoAlpha: 0,
                duration: 1,
                ease: 'none',
                onComplete: ()=> done()
            })
        }

        const  easeOut = (container) => {

            return GSAP.from(container, {
                autoAlpha: 0,
                duration: 1,
                ease: 'none',
            })
        }

       barba.init({
                preventRunning: true,
                transitions: [
                {
                once({ next }) {
                     easeOut(next.container);
                },
                leave({ current }) {
                    const done = this.async();
                    easeIn(current.container, done);
                },
                enter({ next }) {
                     easeOut(next.container);
                }
                }
            ],
            
        })
        
    }
    createNav(){
        return GSAP.timeline({
                paused: true,
                reversed:true
            })
            .to('.drop-down-menu ul',
            {
                height:'auto',
                duration:1,
                ease:'power4.inOut'
            })
    }

   
    createReRender(){
        
        barba.hooks.before(() => {
        })
    
        barba.hooks.after(() => {
            this.pages.home.createReRender()
        })
    }
    createScene(){
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x171717)
        
    }
    createCamera(){
        this.camera = new THREE.PerspectiveCamera( 70, this.screen.width / this.screen.height, 0.01, 10 );
    }

    createRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas:document.querySelector('.main-canvas')
        })
        this.renderer.setSize( this.screen.width, this.screen.height )
        document.body.appendChild( this.renderer.domElement );
    }
    createLights(){ 
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5); 
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
        this.scene.add(ambientLight);
    }
    createAASCIIEffect(){
        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)
        const asciiTexture = new ASCIITexture({
            characters: " ''2254547948@",
            cellCount : 18                         
        })
    
        this.aasciiPass = new EffectPass(this.camera , new ASCIIEffect({
            cellSize:12,
            invert: true,
            
        }))
       
        this.aasciiPass.effects[0].asciiTexture = asciiTexture;
        this.composer.addPass(this.aasciiPass)
    


    }
    createGeometry(){
        this.material = new THREE.MeshStandardMaterial();
        this.controls = new OrbitControls(this.camera,this.renderer.domElement)
        this.controls.enableDamping = true

            
        this.loader = new GLTFLoader();

        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(window.location.href+'/draco/');
        this.loader.setDRACOLoader(this.dracoLoader);
        this.mixer;
        this.loader.load(dragon, (gltf) =>{

            gltf.scene.traverse((child) => {
            child.material = this.material
         
        })
            
            this.scene.add(gltf.scene)
            this.mixer = new THREE.AnimationMixer(gltf.scene);
            const action = this.mixer.clipAction(gltf.animations[0])
            action.play();
            this.mixer.timeScale = 0.3; 
            this.timer = new THREE.Timer()

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
        )

        this.camera.position.z = 1.2;
    }
    onResize() {
      

        this.camera.aspect = this.screen.width / this.screen.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    update(time) {
        if (this.timer) {
            this.timer.update(time)
            const delta = this.timer.getDelta(); 
            this.mixer.update(delta)
        }
   
        // this.renderer.render(this.scene, this.camera);
        this.composer.render()
        this.controls.update()
        this.pages.effects.matrix.createMatrix()

        requestAnimationFrame(this.update.bind(this))


    }

    addEventListeners(){
        
       $(".menu-open, .hamburger").each(function() {
            $(this).on('click touchstart', function() {
                navIsTrue.reversed() ? navIsTrue.play() : navIsTrue.reverse();

                $(".hamburger").toggleClass('open');
            });
        });
        window.addEventListener('resize',this.onResize.bind(this))
    }
}

new App()
