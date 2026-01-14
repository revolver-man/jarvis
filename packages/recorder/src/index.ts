export class Recorder extends EventTarget {
    private mediaRecorder: MediaRecorder | null = null
    private callback: ((blob: Blob) => void) | null = null
    private chunks: Blob[] = []

    public disposed = false

    constructor() {
        super()
        this.ondataavailable = this.ondataavailable.bind(this)
        this.onstop = this.onstop.bind(this)
    }

    private ondataavailable(e: BlobEvent) {
        this.chunks.push(e.data)
    }

    private onstop() {
        if (this.callback) {
            const blob = new Blob(this.chunks, {
                type: 'audio/webm; codecs=opus',
            })
            this.chunks = []
            this.callback(blob)
        }
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
                    mediaRecorder.addEventListener("stop", this.onstop)
                    mediaRecorder.start()
                    this.mediaRecorder = mediaRecorder
                }).catch(() => {
                    
                })
            }
        }
        else {
            if (this.mediaRecorder.state !== 'recording') {
                this.mediaRecorder.start()
            }
        }
    }

    stop(callback: (blob: Blob) => void) {
        if (this.disposed) {
            return
        }
        this.callback = callback
        this.mediaRecorder?.stop()
    }

    dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true
        if (this.mediaRecorder) {
            this.mediaRecorder.removeEventListener("dataavailable", this.ondataavailable)
            this.mediaRecorder.removeEventListener("stop", this.onstop)
            this.mediaRecorder = null
        }
    }
}
