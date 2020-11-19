export function functions(functions, options, callback) {
    this.$http[functions](options).then((res) => {
        if (callback) {
            callback(res)
        }
    })
}
