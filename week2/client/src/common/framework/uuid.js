/* http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
/* eslint-disable */
module.exports=function generateUUID(){
    let d = new Date().getTime();
    if(global.performance && typeof global.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}