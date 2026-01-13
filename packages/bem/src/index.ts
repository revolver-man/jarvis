const firstCharToUpperCase = ([firstChar = '', ...rest]: string) => [firstChar.toUpperCase(), ...rest].join("")

export const createBem = (block: string, prefix = "") => {
    const base = [prefix, block].filter((item) => !!item)
    const name = base.map(firstCharToUpperCase).join("")
    function bem(): string[];
    function bem(element: string): string[];
    function bem(modifiers: string[]): string[]; 
    function bem(element: string, modifier: string): string[];
    function bem(element: string, modifiers: string[]): string[];
    function bem(value1?: string | string[], value2?: string | string[]): string[] {
        const classList = [base.join("-")]
        const modifiers: string[] = []
        if (value1) {
            if (Array.isArray(value1)) {
                modifiers.push(...value1)
            }
            else {
                classList.push(value1)
                if (value2) {
                    if (Array.isArray(value2)) {
                        modifiers.push(...value2)
                    }
                    else {
                        modifiers.push(value2)
                    }
                }
            }
        }
        const baseClass = classList.join("__")
        return [
            baseClass,
            ...modifiers.map((modifier) => [baseClass, modifier].join("--")),
        ]
    }
    return Object.freeze({
        name,
        bem,
    })
}
