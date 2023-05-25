const routePage = (state = "login", action) => {
    if (action.type === 'ROUTE') {
        if (action.payload === "logout") {
            alert("logout clicked:");
            localStorage.clear();
            return "login";
        } else {
            return action.payload;
        }
    } else {
        return state;
    }
}

export default routePage;