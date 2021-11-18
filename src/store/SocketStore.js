export default class SocketStore {
    socket;
    uploader;

    setSocket(socket){
        this.socket = socket; 
    }

    setUploader(uploader){
        this.uploader = uploader; 
    }

    getSocket(){
        return this.socket;
    }

    getUploader(){
        return this.uploader;
    }

}