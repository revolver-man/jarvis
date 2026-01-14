# reorder
## usage
```js
import { Recorder } from 'recorder'

const recorder = new Recorder()
recorder.start()

recorder.stop((blob) => {
    console.log(blob)
})
```
