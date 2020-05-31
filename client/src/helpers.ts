export const getParam = (param: string): string | null => {
    var params = new URLSearchParams(window.location.search);
    return params.get(param);
}