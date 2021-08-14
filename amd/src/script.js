define([],
    function() {
    return {
        init: function(usersession) {
            const video = document.getElementById('videoInput')

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
                faceapi.nets.faceRecognitionNet.loadFromUri('https://ie-scj.edu.pe/entor_eval/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('https://ie-scj.edu.pe/entor_eval/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('https://ie-scj.edu.pe/entor_eval/mod/quiz/accessrule/loginia/models'),
                faceapi.nets.tinyFaceDetector.loadFromUri('https://ie-scj.edu.pe/entor_eval/mod/quiz/accessrule/loginia/models') //heavier/accurate version of tiny face detector
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
                        document.getElementById("id_loginiamessagetext").value = nameUser
                        document.getElementById("id_percent").value = percent
                    }, 100)
                })
            }

            function loadLabeledImages() {
                const labels = [usersession]
                return Promise.all(
                    labels.map(async (label)=>{
                        const descriptions = []
                        for(let i=1; i<=4; i++) {
                            const img = await faceapi.fetchImage(`https://ie-scj.edu.pe/entor_eval/mod/quiz/accessrule/loginia/labeled_images/${label}/${i}.jpg`)
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