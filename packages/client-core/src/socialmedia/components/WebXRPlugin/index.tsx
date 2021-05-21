import { Capacitor, Plugins } from '@capacitor/core';
import "webxr-native";
import React, { useEffect, useState } from 'react';
import {
    AxesHelper,
    BoxGeometry, CameraHelper, Color,
    GridHelper, Group,
    Mesh,
    MeshBasicMaterial, OrthographicCamera,
    PerspectiveCamera,
    Quaternion,
    Scene,
    Vector3,
    WebGLRenderer
} from 'three';
import VideocamIcon from '@material-ui/icons/Videocam';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';

//@ts-ignore
import styles from './WebXRPlugin.module.scss';
import { connect } from 'react-redux';
import { updateNewFeedPageState, updateWebXRState } from '../../reducers/popupsState/service';
import { bindActionCreators, Dispatch } from 'redux';
import { selectPopupsState } from '../../reducers/popupsState/selector';

const mapStateToProps = (state: any): any => {
    return {
        popupsState: selectPopupsState(state),
     
    };
  };

  const mapDispatchToProps = (dispatch: Dispatch): any => ({
    updateNewFeedPageState: bindActionCreators(updateNewFeedPageState, dispatch),
    updateWebXRState: bindActionCreators(updateWebXRState, dispatch),
    
});

interface Props{
    popupsState?: any;
    updateNewFeedPageState?: typeof updateNewFeedPageState;
    updateWebXRState?: typeof updateWebXRState;
    setContentHidden?: any
  }

const { isNative } = Capacitor;

enum RecordingStates {
    OFF = "off",
    ON = "on",
    STARTING = "starting",
    ENDING = "ending"
}

const meshFilePath = typeof location !== 'undefined' ? location.origin + "/volumetric/liam.drcs" : "";
const videoFilePath = typeof location !== 'undefined' ? location.origin + "/volumetric/liam.mp4" : "";
const PI2 = Math.PI * 2;

const correctionQuaternionZ = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), Math.PI/2);

const _DEBUG = false;
const DEBUG_MINI_VIEWPORT_SIZE = 100;

export const WebXRPlugin = ({popupsState, updateNewFeedPageState, updateWebXRState, setContentHidden}:Props) => {
    const canvasRef = React.useRef();
    const [initializationResponse, setInitializationResponse] = useState("");
    const [cameraStartedState, setCameraStartedState] = useState("");
    const [cameraPoseState, setCameraPoseState] = useState("");
    const [anchorPoseState, setAnchorPoseState] = useState("");
    const [intrinsicsState, setCameraIntrinsicsState] = useState("");
    const [savedFilePath, setSavedFilePath] = useState("");
    const [horizontalOrientation, setHorizontalOrientation] = useState(false);
    const [recordingState, setRecordingState] = useState(RecordingStates.OFF);
    let renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera;
    const debugCamera: {
        userCameraHelper: CameraHelper,
        overview: PerspectiveCamera,
        xz: OrthographicCamera
        xy: OrthographicCamera
        zy: OrthographicCamera
    } = {
        userCameraHelper: null,
        overview: null,
        xz: null,
        xy: null,
        zy: null
    };

    const raf = () => {

        renderer.render(scene, camera);

        if (_DEBUG) {
            const clearColor = new Color();
            renderer.getClearColor(clearColor);
            const clearAlpha = renderer.getClearAlpha();

            debugCamera.userCameraHelper.visible = true;

            renderer.setScissorTest(true);
            renderer.setClearColor(0xa0a0a0, 1);

            renderer.setViewport(10, 10 * 2 + DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE);
            renderer.setScissor(10, 10 * 2 + DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE);
            renderer.render(scene, debugCamera.overview);

            [debugCamera.xz, debugCamera.xy, debugCamera.zy].forEach((cam, index) => {
                const left = 10 + (DEBUG_MINI_VIEWPORT_SIZE + 10) * index;
                renderer.setViewport(left, 10, DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE);
                renderer.setScissor(left, 10, DEBUG_MINI_VIEWPORT_SIZE, DEBUG_MINI_VIEWPORT_SIZE);
                renderer.render(scene, cam);
            });

            // reset changes
            debugCamera.userCameraHelper.visible = false;
            renderer.setClearColor(clearColor, clearAlpha);
            renderer.setScissorTest(false);
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        }

        requestAnimationFrame(raf);
    };
    useEffect(() => {
        (async function () {
            scene = new Scene();

            if (_DEBUG) {
                debugCamera.xz = new OrthographicCamera(2, -2, 2, -2, 0.001, 100);
                debugCamera.xz.position.y = 10;
                debugCamera.xz.rotateX(-Math.PI / 2);

                debugCamera.xy = new OrthographicCamera(2, -2, 2, -2, 0.001, 100);
                debugCamera.xy.position.z = 10;

                debugCamera.zy = new OrthographicCamera(2, -2, 2, -2, 0.001, 100);
                debugCamera.zy.position.x = 10;
                debugCamera.zy.rotateY(Math.PI / 2);
            }

            const geometry = new BoxGeometry(.1, .1, .1);
            const materialX = new MeshBasicMaterial({ color: 0xff0000 });
            const materialY = new MeshBasicMaterial({ color: 0x00ff00 });
            const materialZ = new MeshBasicMaterial({ color: 0x0000ff });
            const materialC = new MeshBasicMaterial({ color: 0xffffff });
            const anchor = new Group();
            anchor.add(new AxesHelper(0.3));
            const anchorC = new Mesh(geometry, materialC);
            anchor.add(anchorC);
            const anchorX = new Mesh(geometry, materialX);
            anchorX.position.x = 0.3;
            anchor.add(anchorX);
            const anchorY = new Mesh(geometry, materialY);
            anchorY.position.y = 0.3;
            anchor.add(anchorY);
            const anchorZ = new Mesh(geometry, materialZ);
            anchorZ.position.z = 0.3;
            anchor.add(anchorZ);

            scene.add(new AxesHelper(0.2));

            camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100);

            if (_DEBUG) {
                debugCamera.overview = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100);
                debugCamera.overview.position.set(3, 3, 3);
                debugCamera.overview.lookAt(new Vector3());
            }
            scene.background = null;
            renderer = new WebGLRenderer({ alpha: true, canvas:canvasRef.current });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            renderer.domElement.style.position = "fixed";
            renderer.domElement.style.width = "100vw";
            renderer.domElement.style.height = "100vh";
            renderer.domElement.style.zIndex = "-1";

            renderer.domElement.style.top = "0";
            renderer.domElement.style.left = "0";
            renderer.domElement.style.margin = "0";
            renderer.domElement.style.padding = "0";
            scene.add(camera);

            if (_DEBUG) {
                debugCamera.userCameraHelper = new CameraHelper(camera);
                scene.add(debugCamera.userCameraHelper);
            }

            scene.add(anchor);
            anchor.position.set(0, 0, 0);

            scene.add(new AxesHelper(2));
            const gh = new GridHelper(2);
            scene.add(gh);

            requestAnimationFrame(raf);

            const { XRPlugin } = Plugins;

            await XRPlugin.initialize({}).then(response => {
                setInitializationResponse(response.status);
            }).catch(error => console.log(error.message));

            // @ts-ignore
            XRPlugin.addListener('poseDataReceived', (data: any) => {

                const {
                    cameraPositionX,
                    cameraPositionY,
                    cameraPositionZ,
                    cameraRotationX,
                    cameraRotationY,
                    cameraRotationZ,
                    cameraRotationW,
                } = data;

                // TODO:
                // Set camera position and rotation
                // Enable cube and move to position/rotation if placed is true
                setCameraPoseState(JSON.stringify({
                    cameraPositionX,
                    cameraPositionY,
                    cameraPositionZ,
                    cameraRotationX,
                    cameraRotationY,
                    cameraRotationZ,
                    cameraRotationW
                }));

                camera.quaternion
                  .set(cameraRotationX, cameraRotationY, cameraRotationZ, cameraRotationW)
                  .multiply(correctionQuaternionZ);
                camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);

                camera.updateProjectionMatrix();

                if (_DEBUG) {// sync cams
                    debugCamera.overview.lookAt(camera.position);
                    debugCamera.xz.position.x = camera.position.x;
                    debugCamera.xz.position.z = camera.position.z;
                    debugCamera.xy.position.x = camera.position.x;
                    debugCamera.xy.position.y = camera.position.y;
                    debugCamera.zy.position.z = camera.position.z;
                    debugCamera.zy.position.y = camera.position.y;
                }// sync cams


                if (data.placed) {
                    const {
                        anchorPositionX,
                        anchorPositionY,
                        anchorPositionZ,
                        anchorRotationX,
                        anchorRotationY,
                        anchorRotationZ,
                        anchorRotationW
                    } = data;

                    setAnchorPoseState(JSON.stringify({
                        anchorPositionX,
                        anchorPositionY,
                        anchorPositionZ,
                        anchorRotationX,
                        anchorRotationY,
                        anchorRotationZ,
                        anchorRotationW
                    }));

                    anchor.quaternion
                      .set(anchorRotationX, anchorRotationY, anchorRotationZ, anchorRotationW)
                      .multiply(correctionQuaternionZ);
                    anchor.position.set(anchorPositionX, anchorPositionY, anchorPositionZ);
                }

            });

            // @ts-ignore
            XRPlugin.addListener('cameraIntrinsicsReceived', (data: any) => {

                setCameraIntrinsicsState(JSON.stringify({
                    fX: data.fX,
                    fY: data.fY,
                    cX: data.cX,
                    cY: data.cy,
                    x: data.x,
                    y: data.y
                }));

                // TODO: checkout focal length
                // camera.setFocalLength(data.fY/10);
                // camera.setFocalLength(50);

                // TODO:
                // Set camera position and rotation
                // Enable cube and move to position/rotation if placed is true
            });


            XRPlugin.start({}).then(() => {
                setCameraStartedState(isNative ? "Camera started on native" : "Camera started on web");
            }).catch(error => console.log(error.message));
        })();
    }, []);

    const finishRecord = () => {

              setRecordingState(RecordingStates.OFF);
               setContentHidden();
               if(horizontalOrientation){
                   setHorizontalOrientation(false);
               }
               document.removeEventListener('dblclick', ()=> {
                   console.log('Double Click listener was removed');
               }, false);

               // @ts-ignore
               Plugins.XRPlugin.stopRecording().
               // @ts-ignore
               then(({ result, filePath }) => {
                   console.log("END RECORDING, result IS", result);
                   console.log("filePath IS", filePath);
                   setSavedFilePath("file://" + filePath);
                   const videoPath = Capacitor.convertFileSrc(filePath);
                   updateWebXRState(false);
                   Plugins.XRPlugin.stop();
                   updateNewFeedPageState(true, videoPath);
               }).catch(error => alert(error.message));
        };



    const toggleRecording = () => {
        if (recordingState === RecordingStates.OFF) {
            setRecordingState(RecordingStates.ON);
            setContentHidden();
            //TODO: check why there are errors
            // @ts-ignore
            Plugins.XRPlugin.startRecording({
                isAudio: true,
                width: 1024,
                height: 1024,
                bitRate: 1000,
                dpi: 100,
                filePath: "/test.mp4"
            }).then(({ status }) => {
                console.log("RECORDING, STATUS IS", status);
            }).catch(error => console.log(error.message));
            
             document.addEventListener('dblclick', (e) => {
                finishRecord();
            });
        }
        else if (recordingState === RecordingStates.ON) {
            finishRecord();
        }
    };

    const handleTap = () => {
        Plugins.XRPlugin.handleTap();
    };

    const playVideo = () => {
        // @ts-ignore
        Plugins.XRPlugin.playVideo();
    };

    const pauseVideo = () => {
        // @ts-ignore
        Plugins.XRPlugin.pauseVideo();
    };


    const clearAnchors = () => {
        // @ts-ignore
        Plugins.XRPlugin.clearAnchors();
    };

    const stopRecord = () => {
        // @ts-ignore
        Plugins.XRPlugin.stop({});
    };

    // useEffect(() => {
    //     setSecondState("Initialized and effected");
    // }, [initializationResponse]);

    return (<>
        {/* <div className="plugintest">
            <div className="plugintestReadout">
                <p>IR:{initializationResponse}</p>
                <p>CSS:{cameraStartedState}</p>
                <p>IS:{intrinsicsState}</p>
                <p>CPS:{cameraPoseState}</p>
                <p>APS:{anchorPoseState}</p>
            </div>
        </div> */}

         <div className={horizontalOrientation ? styles.horizontalOrientation + " plugintestControls" : "plugintestControls"}>
              <section className={styles.waterMarkWrapper}>
                  <section className={styles.waterMark}>
                      <section className={styles.subContainer} />
                    </section>
                </section>
                <button type="button" className={styles.flipCamera} onClick={() => {}}><FlipCameraIosIcon /></button> 
                <button type="button" className={styles.changeOrientation} onClick={() => {setHorizontalOrientation(!horizontalOrientation);}}><FlipCameraIosIcon /></button>
                <section className={recordingState === RecordingStates.OFF ? styles.startButtonWrapper : styles.stopButtonWrapper}>
                    {/*{recordingState === RecordingStates.OFF ? "Record" : "Stop Recording"}*/}
                    <button type="button" className={recordingState === RecordingStates.OFF ? styles.startButton : styles.stopButton} onClick={() => toggleRecording()}>
                        <VideocamIcon />
                    </button>
                </section>
              {/* <button type="button" style={{ padding: "1em" }} onClick={() => handleTap()}>Place AR</button> */}
              {/* <button type="button" style={{ padding: "1em" }} onClick={() => clearAnchors()}>clearAnchors</button> */}
              {/* <button type="button" style={{ padding: "1em" }} onClick={() => playVideo()}>playVideo</button> */}
              {/* <button type="button" style={{ padding: "1em" }} onClick={() => pauseVideo()}>pauseVideo</button> */}
              <section className={styles.closeButtonWrapper}>
                <button type="button" className={styles.closeButton} onClick={() => stopRecord()}><ChevronLeftIcon />Slide to cancel</button> 
            </section>
          </div>
          <canvas ref={canvasRef} className={styles.arcCanvas} id={'arcCanvas'} onClick={() => handleTap()} />
        {/* <VolumetricPlayer
                        meshFilePath={meshFilePath}
                        videoFilePath={videoFilePath}
                        cameraVerticalOffset={0.5}
                    /> */}
    </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps) (WebXRPlugin);
