export class Recorder extends EventTarget {
    private mediaRecorder: MediaRecorder | null = null
    private chunks: Blob[] = []

    public disposed = false

    constructor() {
        super()
        this.ondataavailable = this.ondataavailable.bind(this)
    }

    private ondataavailable(e: BlobEvent) {
        this.chunks.push(e.data)
    }

    start() {
        if (this.disposed) {
            return
        }
        if (!this.mediaRecorder) {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                }).then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream)
                    mediaRecorder.addEventListener("dataavailable", this.ondataavailable)
                    mediaRecorder.start()
                    this.mediaRecorder = mediaRecorder
                }).catch(() => {
                    
                })
            }
        }
        else {
            this.mediaRecorder?.start()
        }
    }

    stop() {
        if (this.disposed) {
            return
        }
        this.mediaRecorder?.stop()
        return new Promise((resolve) => {
            const blob = new Blob(this.chunks, {
                type: 'audio/ogg',
            })
            this.chunks = []
            resolve(blob)
        })
    }

    dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true
        if (this.mediaRecorder) {
            this.mediaRecorder.removeEventListener("dataavailable", this.ondataavailable)
            this.mediaRecorder = null
        }
    }
}
