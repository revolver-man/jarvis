export class Speaker extends EventTarget {
    private audios: HTMLAudioElement[] = []
    private playing = false

    private play() {
        if (!this.playing && this.audios.length > 0) {
            const audio = this.audios[0]
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (audio && audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                this.playing = true
                audio.play()
            }
        }
    }

    say(blob: Blob): void;
    say(url: string): void;
    say(src: string | Blob) {
        const audio = new Audio()
        audio.addEventListener("canplay", () => {
            this.play()
        })
        audio.addEventListener("ended", () => {
            this.audios.shift()
            this.playing = false
            this.play()
        })
        if (src instanceof Blob) {
            const url = URL.createObjectURL(src)
            audio.src = url
            setTimeout(() => {
                URL.revokeObjectURL(url)
            })
        }
        else {
            audio.src = src
        }
        this.audios.push(audio)
    }

    stop() {
        if (this.playing && this.audios.length > 0) {
            const audio = this.audios[0]
            if (audio) {
                audio.pause()
            }
        }
        this.playing = false
        this.audios = []
    }
}
