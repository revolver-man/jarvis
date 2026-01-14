export class Speaker extends EventTarget {
    private audios: HTMLAudioElement[] = []
    private playing = false

    private play() {
        if (!this.playing && this.audios.length > 0) {
            const audio = this.audios[0]
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (audio && audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                this.playing = true
                console.log('play', this.audios)
                audio.play()
            }
        }
    }

    say(src: string) {
        const audio = new Audio(src)
        audio.addEventListener("canplay", () => {
            this.play()
        })
        audio.addEventListener("ended", () => {
            this.audios.shift()
            console.log('stop', this.audios)
            this.playing = false
            this.play()
        })
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
