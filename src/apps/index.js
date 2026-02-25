import Home from './home';
import Contact from './contact';
import barba from '@barba/core';
import GSAP from 'gsap';
import _ from '../scss/main.scss';

import * as THREE from 'three';
import {  EffectComposer, EffectPass, RenderPass , ASCIIEffect , ASCIITexture } from "postprocessing";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import dragon from '../media/models/dragonfly.glb'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class App{
    constructor(){
        this.pages = {
            home : new Home(),
            contact : new Contact()
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

    createReRender(){
        
        barba.hooks.before(() => {
        })
    
        barba.hooks.after(() => {
            this.pages.home.createReRender()
        })
    }
    createScene(){
        this.scene = new THREE.Scene();
        
    }
    createCamera(){
        this.camera = new THREE.PerspectiveCamera( 70, this.screen.width / this.screen.height, 0.01, 10 );
        this.camera.position.z = 1;
    }

    createRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            antialias : window.devicePixelRatio < 2
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }
    createAASCIIEffect(){
        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)

   

        // 1. Create the texture with your custom string
        const asciiTexture = new ASCIITexture({
            cellCount: 6,  
            fontSize: 16,
            resolution: 1,             
        });
        asciiTexture.needsUpdate = true;


        this.aasciiPass = new EffectPass(this.camera , new ASCIIEffect({
            texture: asciiTexture,
            cellSize: 5,
        }))
        this.composer.addPass(this.aasciiPass)


    }
    createGeometry(){
        this. geometry = new THREE.TorusGeometry( 6, 3, 60, 30,40);
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this. cube = new THREE.Mesh(this. geometry, this.material );
        // this.scene.add( this.cube );
            this.controls = new OrbitControls(this.camera,this.renderer.domElement)
            this.controls.enableDamping = true
      
             const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(0, 5, 5); // angled light
                directionalLight.castShadow = true;
                this.scene.add(directionalLight);


                // Optional: subtle ambient light for fill
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                this.scene.add(ambientLight);
                
            const loader = new GLTFLoader();

            const dracoLoader = new DRACOLoader();
            // Set the path to the Draco decoder files
            dracoLoader.setDecoderPath('/draco/'); // <-- You’ll need these files in your public folder
            loader.setDRACOLoader(dracoLoader);

            loader.load(
            dragon, (gltf) =>{

                const model = gltf.scene;

             

                 gltf.scene.traverse((child) => {

                    child.material = this.material;

                    // child.scale.set(0.8, 0.8, 0.8);
                    child.position.set(0, 0, 0);

                
    
                })
        
                this.scene.add(model)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
            )



        this.camera.position.z = 3;
    }

    update( time ) {

        this.cube.rotation.x = time / 2000;
        this.cube.rotation.y = time / 1000;

        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
        this.controls.update()

        requestAnimationFrame(this.update.bind(this))


    }

    addEventListeners(){
       
    }
}

new App()
