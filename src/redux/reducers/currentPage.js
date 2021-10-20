const currentPage = (state="home",action) =>{
    alert("inside current page:");
    switch(action.type){
        case 'CURRENTPAGE':
            return action.payload;
        default:
            return state;
    }
}
export default currentPage;