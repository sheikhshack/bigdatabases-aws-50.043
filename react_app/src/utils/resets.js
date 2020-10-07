// The following is a simple way to reset forms
export const resetAll = (...hooks) => {
    hooks.forEach((hook) => {
        hook.reset()
    })
}

// The following is a simple way to remove the reset key for JSX
export const removeReset = (original) => {
    const { reset, ...result } = original
    return result
}