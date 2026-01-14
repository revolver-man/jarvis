# reorder
## usage
```js
import { Recorder } from 'recorder'

const recorder = new Recorder()
recorder.start()

recorder.stop().then((blob) => {
    console.log(blob)
})
```
