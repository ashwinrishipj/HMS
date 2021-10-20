const currentPage = (state="home",action) =>{
    switch(action.type){
        case 'CURRENTPAGE':
            return action.payload;
        default:
            return state;
    }
}
export default currentPage;