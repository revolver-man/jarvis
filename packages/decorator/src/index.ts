export const debounce = function<T extends (...args: any) => void>(func: T, ms = 250) {
    let id = 0
    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (id) {
            clearTimeout(id)
        }
        id = setTimeout(() => {
            func.call(this, ...args)
        }, ms)
    }
}

export const throttle = function<T extends (...args: any) => void>(func: T, ms = 250) {
    let isThrottled = false
    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (isThrottled) {
            return
        }
        isThrottled = true
        func.call(this, ...args)
        setTimeout(() => {
            isThrottled = false
        }, ms)
    }
}
