import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile} from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDxERtCd4bbhhE4ZIizclQu42g0g3SAXbw",
  authDomain: "imagestorage-52b26.firebaseapp.com",
  databaseURL: "https://imagestorage-52b26.firebaseio.com",
  projectId: "imagestorage-52b26",
  storageBucket: "imagestorage-52b26.appspot.com",
  messagingSenderId: "1004186735476"
};

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  galleryType;
 
  imageURI;
  stringPic;
  stringVideo;
  stringAudio;
  upload;
  uploadFile={
    name:'',
    downloadUrl:''
  }
  fire={
    downloadUrl:''
  };
  
  firebaseUploads;
  constructor(public navCtrl: NavController, public navParams: NavParams,private mediaCapture: MediaCapture, 
    private platform : Platform, private f : File) {
    
    firebase.initializeApp(config);
    this.upload = firebase.database().ref('/upload/');
    this.firebaseUploads = firebase.database().ref('/fireuploads/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');;
  }

  uploads(type) {
    this.platform.ready().then(() => {
      let promise
      switch (type) {
        case 'camera':
          promise = this.mediaCapture.captureImage()
          break
        case 'video':
          promise = this.mediaCapture.captureVideo()
          break
        case 'audio':
          promise = this.mediaCapture.captureAudio()
          break
      }
      promise.then((mediaFile: MediaFile[]) => {
        console.log(mediaFile);
      
        this.imageURI = mediaFile[0].fullPath;
        var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
        console.log(name);
       
        // switch (type) {
        //   case 'camera':
        //     this.stringPic = this.imageURI;
        //     this.uploadFile.name ="Camera Image"
        //     this.uploadFile.downloadUrl =  this.stringPic;
        //     this.upload.push({name:"Camera Image",downloadUrl: this.stringPic});
        //     break
        //   case 'video':
        //   this.stringVideo = this.imageURI;
        //   this.uploadFile.name ="Video"
        //   this.uploadFile.downloadUrl =   this.stringVideo ;
        //   this.upload.push({name:"Video",downloadUrl: this.stringVideo});
        //     break
        //   case 'audio':
        //   this.stringAudio = this.imageURI;
        //   this.uploadFile.name ="Audio"
        //   this.uploadFile.downloadUrl =  this.stringAudio;
        //   this.upload.push({name:"Audio",downloadUrl: this.stringAudio});
        //     break
        // }
        var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
        return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
          console.log(buffer)
          console.log('Uploading file')
          var blob = new Blob([buffer], { type: mediaFile[0].type });
          console.log(blob.size);
          console.log(blob)
          const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
          return storageRef.put(blob).then((snapshot:any) => {
            console.log('Upload completed')
            //this.loader.dismiss;
            console.log(snapshot.Q)
             let  files = [];
            storageRef.getDownloadURL().then((url) => {
              this.fire.downloadUrl = url;
              this.firebaseUploads.push({downloadUrl: url});
              return this.fire.downloadUrl;
            });
            console.log(this.firebaseUploads); 
          })
          // return this.userService.saveProfilePicture(blob)
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      })
    });
  }
// Display Pictures
  i;
  imageview;
  images=[];
  count=0;
  picname;

  dispaly(){

  firebase.database().ref('/fireuploads/').on("value",(snapshot) => {
    snapshot.forEach((snap) => {
    this.i={keyname:snap.key,name:snap.val().downloadUrl};
    this.imageview=this.i.name;
    //this.images.push(this.imageview);

    if(this.imageview.lastIndexOf('.jpg') >= 0){
      this.images.push(this.imageview);
  }
    // this.picname=snap.val().downloadUrl;
    console.log('++++++++++++++++++++++++++'+this.imageview);
    console.log(snap.val().downloadUrl)
    this.count++;
    return false;
    
    })
   
  });

}
// Display Videos
keywordd;
videoview;
videos=[];
counter=0;


displayVideo(){

firebase.database().ref('/fireuploads/').on("value",(snapshot) => {
  snapshot.forEach((snap) => {
  this.keywordd={name:snap.val().downloadUrl,keyname:snap.key};
  this.videoview=this.keywordd.name;
  this.videos.push(snap.val().downloadUrl);

  if(this.videoview.lastIndexOf('.mp4') >= 0){
    this.videos.push(this.videoview);
}

 
  this.videoview=snap.val().downloadUrl;
  console.log('=========================='+ this.videoview);
  this.counter++;
  return false;
  
  })
 
});
}
// Display Audio
keywordAudio;
Audioview;
audios=[];
countt=0;


diplayAudio(){
firebase.database().ref('/fireuploads/').on("value",(snapshot) => {
  snapshot.forEach((snap) => {
  this.keywordAudio={name:snap.val().downloadUrl,keyname:snap.key};
  this.Audioview=this.keywordAudio.name;
  this.audios.push(this.Audioview);


  this.counter++;
  return false;
  
  })
 
});
}
}
  
