const webCam2 = function (setector) {
    if (!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices) {
        alert("error...");
    }
    // get page elements
    var video = setector.querySelector("video"),
        // video constraints
        constraints = {
            video: {
                width: {
                    min: 300,
                    ideal: 300,
                    max: 300,
                },
                height: {
                    min: 300,
                    ideal: 300,
                    max: 300,
                },
            },
        },

        // use front face camera
        useFrontCamera = true,
        // current video stream
        videoStream;

    // stop video stream
    function stopVideoStream() {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    // initialize
    async function initializeCamera() {
        stopVideoStream();
        constraints.video.facingMode = useFrontCamera ? "user" : "environment";
        try {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = videoStream;
        } catch (err) {
            alert("Could not access the camera");
        }
    }

    return {
        selector: setector,
        video: video,
        init: initializeCamera,
        stop: stopVideoStream,
        switch: function () {
            useFrontCamera = !useFrontCamera;
            return this.init();
        },
        screenShot: function(){
            var vdio = this.video, 
            context,
            base64,
            streem =  this.selector.querySelector( ".sst-webcam" );
            canvas = document.createElement("canvas");
            streem.append( canvas );
            canvas.height = vdio.videoHeight;
            canvas.width = vdio.videoWidth;
            context = canvas.getContext('2d');
            context.drawImage(vdio, 0, 0, canvas.width, canvas.height);
            base64 = canvas.toDataURL("image/png");
            this.stop();

            return base64;

        }
    };
};