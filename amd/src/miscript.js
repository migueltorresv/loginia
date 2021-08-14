define([],
    function() {
    return {
        init: function(usersession, cmd) {
            const video = document.getElementById('videoInput')
            const usr = usersession
            function start() {
                navigator.getUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia 
                );
                navigator.getUserMedia(
                    { video:{} },
                    stream => video.srcObject = stream,
                    err => console.error(err)
                )
                console.log('video added')
                recognizeFaces()
            }

            Promise.all([
                faceapi.nets.faceRecognitionNet.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.tinyFaceDetector.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models') //heavier/accurate version of tiny face detector
            ]).then(start)

            async function recognizeFaces() {

                const labeledDescriptors = await loadLabeledImages()
                console.log(labeledDescriptors)
                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
                let nameUser = ""
                let percent = ""

                video.addEventListener('play', async () => {
                    console.log('Playing')
                    const displaySize = { width: video.width, height: video.height } 

                    setInterval(async () => {
                        let inputSize = 128
                        let scoreThreshold = 0.5
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors()
                        const resizedDetections = faceapi.resizeResults(detections, displaySize)

                        const results = resizedDetections.map((d) => {
                            return faceMatcher.findBestMatch(d.descriptor)
                        })
                        
                        results.forEach( (result, i) => {
                            const box = resizedDetections[i].detection.box
                            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                            nameUser = result._label
                            percent = parseInt(result._distance * 100) + " %"
                        })
                        if(usr != nameUser) {
                            document.getElementById("id_loginiamessagetext").value = "unknown"
                        } else {
                            document.getElementById("id_loginiamessagetext").value = nameUser
                        }
                        document.getElementById("id_percent").value = percent
                    }, 100)
                })
            }

            function loadLabeledImages() {
                const labels = ['Churampi Rosales','Gutarra Castillo', 'Jimmi Bruno', 'Miguel Torres','Sario Chamorro']
                const dir = cmd
                return Promise.all(
                    labels.map(async (label)=>{
                        const descriptions = []
                        for(let i=1; i<=3; i++) {
                            const img = await faceapi.fetchImage(`/moodle2/mod/quiz/accessrule/loginia/labeled_images/${label}/${i}.jpg`)
                            let inputSize = 128
                            let scoreThreshold = 0.5
                            const detections = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptor()
                            descriptions.push(new Float32Array( detections.descriptor))
                        }
                        return new faceapi.LabeledFaceDescriptors(label, descriptions )
                    })
                )
            }
        },
        setup: function(usersession) {
            const usr = usersession
            const div = document.getElementById('mod_quiz_navblock')
            const div1 = document.createElement('div')
            const vid = document.createElement('video')
            vid.id = 'video'
            vid.controls = true
            div.append(div1)
            div1.appendChild(vid)

            const video = document.getElementById('video')
            var width = "230";
            var height = 0;
            var streaming = false;

            function start() {
                navigator.getUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia 
                );
                navigator.getUserMedia(
                    { video:{} },
                    stream => video.srcObject = stream,
                    err => console.error(err)
                )
                height = video.videoHeight / (video.videoWidth / width);
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                streaming = true;

                console.log('video added')
                recognizeFaces()
            }

            Promise.all([
                faceapi.nets.faceRecognitionNet.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.tinyFaceDetector.loadFromUri('/moodle2/mod/quiz/accessrule/loginia/models') //heavier/accurate version of tiny face detector
            ]).then(start)

            async function recognizeFaces() {

                const labeledDescriptors = await loadLabeledImages()
                console.log(labeledDescriptors)
                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
                let nameUser = ""
                let percent = ""
                let resultado_label = ""
                let intentos = 0

                video.addEventListener('play', async () => {
                    console.log('Playing')
                    const canvas = faceapi.createCanvasFromMedia(video)

                    let { left, top } = video.getBoundingClientRect(); 
                    top += 10
                    canvas.style.left = `${left}px`
                    canvas.style.top = `${top}px`
                    canvas.style.position = 'absolute'

                    document.body.appendChild(canvas)

                    const displaySize = { width: video.width, height: video.height }
                    faceapi.matchDimensions(canvas, displaySize)     

                    setInterval(async () => {
                        let inputSize = 128
                        let scoreThreshold = 0.5
                    
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors()
                        const resizedDetections = faceapi.resizeResults(detections, displaySize)
                        
                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

                        const results = resizedDetections.map((d) => {
                            return faceMatcher.findBestMatch(d.descriptor)
                        })
                        
                        results.forEach( (result, i) => {
                            const box = resizedDetections[i].detection.box
                            nameUser = result._label
                            percent = parseInt(result._distance * 100) + " %"
                            if(nameUser != usr) {
                                nameUser = "unknown"
                                intentos++
                                alert("Advertencia número" + intentos)
                            }
                            resultado_label = `${nameUser} ${percent}`
                            const drawBox = new faceapi.draw.DrawBox(box, { label: resultado_label.toString() })
                            drawBox.draw(canvas)
                            
                        })

                    }, 100)
                })
            }

            function loadLabeledImages() {
                const labels = ['Churampi Rosales','Gutarra Castillo', 'Jimmi Bruno', 'Miguel Torres', 'Sario Chamorro']
                return Promise.all(
                    labels.map(async (label)=>{
                        const descriptions = []
                        for(let i=1; i<=3; i++) {
                            const img = await faceapi.fetchImage(`/moodle2/mod/quiz/accessrule/loginia/labeled_images/${label}/${i}.jpg`)
                            let inputSize = 128
                            let scoreThreshold = 0.5
                            const detections = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptor()
                            console.log(label + i + JSON.stringify(detections))
                            descriptions.push(new Float32Array( detections.descriptor))
                        }
                        return new faceapi.LabeledFaceDescriptors(label, descriptions )
                    })
                )
            }
        }
    };
});

