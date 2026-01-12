type ShowOpenFilePickerType = {
    description?: string;
    accept: Record<string, string[]>;
}

type ShowOpenFilePickerOptions = {
    excludeAcceptAllOptions?: boolean;
    id?: string;
    multiple?: boolean;
    startIn?: ['desktop', 'documents', 'downloads', 'music', 'pictures', 'videos'];
    types?: Array<ShowOpenFilePickerType>;
}

export const showOpenFilePicker = (options: ShowOpenFilePickerOptions = {}): Promise<Array<File>> => {
    const {
        excludeAcceptAllOptions = false,
        id,
        multiple = false,
        startIn,
        types = [],
    } = options
    return new Promise((resolve, reject) => {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        if (multiple) {
            input.setAttribute("multiple", "")
        }
        const accept = types.reduce<string[]>((accept, type) => {
            Object.values(type.accept).forEach((extensions) => {
                accept.push(...extensions)
            })
            return accept
        }, [])
        if (accept.length > 0) {
            input.setAttribute("accept", accept.join(","))
        }
        input.style.display = 'none'
        document.body.appendChild(input)
        const change = (e: Event) => {
            if (e.target) {
                const target = e.target as HTMLInputElement
                resolve(Array.from(target.files ?? []).map((file) => file))
            }
        }
        const error = () => {
            reject()
        }
        const focus = () => {
            setTimeout(() => {
                window.removeEventListener("focus", focus)
                input.removeEventListener("change", change)
                input.removeEventListener("error", error)
                document.body.removeChild(input)
            }, 350)
        }
        input.addEventListener("change", change)
        input.addEventListener("error", error)
        window.addEventListener("focus", focus)
        input.click()
    })
}
