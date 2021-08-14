const video = document.getElementById('videoInput')
var streaming = false;
function start() {
    //document.body.append('Models Loaded')
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

    video.addEventListener('play', async () => {
        console.log('Playing')
        const canvas = faceapi.createCanvasFromMedia(video)

        let { left, top } = video.getBoundingClientRect();
            
        canvas.style.left = `${left}px`
        canvas.style.top = `${top}px`
        canvas.style.position = 'absolute'

        document.body.appendChild(canvas)

        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)     

        setInterval(async () => {
            let inputSize = 128
            let scoreThreshold = 0.5
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
            
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors()
            //const detections = await faceapi.detectAllFaces(video, options)

            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
                nameUser = result._label
                percent = parseInt(result._distance * 100) + " %"
            })
            document.getElementById("id_loginiamessagetext").value = nameUser
            document.getElementById("id_percent").value = percent
        }, 100)
    })

    
}

function loadLabeledImages() {
    //const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Iron Man', 'Miguel Torres', 'Thor', 'Tony Stark']
    const labels = ['Jimmi Bruno', 'Miguel Torres'] // for WebCam
    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=4; i++) {
                const img = await faceapi.fetchImage(`/moodle2/mod/quiz/accessrule/loginia/labeled_images/${label}/${i}.jpg`)
                //const img = await faceapi.fetchImage(`https://migueltorresv.github.io/faceapi/labeled_images/${label}/${i}.jpg`)
                let inputSize = 128
                let scoreThreshold = 0.5
                const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
                //const detections = await faceapi.detectSingleFace(img, options)
                const detections = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i + JSON.stringify(detections))
                descriptions.push(new Float32Array( detections.descriptor))
            }
            //document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions )
        })
    )
}