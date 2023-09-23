if (import.meta.env.DEV) {
    window.global = undefined;
    // Necessary for development because in development react-mathquill checks
    // the value of the `global` variable but throws an error because it doesn't
    // exist
}
