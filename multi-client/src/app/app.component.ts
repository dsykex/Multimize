import { Component, ElementRef, ViewChild } from '@angular/core';
import io from 'socket.io-client';
import {CameraResultType, Plugins, CameraSource} from '@capacitor/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import "@ionic/pwa-elements";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('camera', {static: false}) videoElement: ElementRef;
  title = 'multi-client';

  socket: any;
  width: number;
  updateVal: number = 1;
  connections: number = 0;

  adj = 'people';

  img: SafeResourceUrl;

  constructor()
  {
    this.socket = io('https://mighty-thicket-03422.herokuapp.com/');

    this.socket.on('width_value', val => {
      this.width = val;
    })

    this.socket.on('connections_changed', cons => {
      this.connections = cons;
      if(this.connections > 1 || this.connections == 0)
        this.adj = 'people are';
      else
        this.adj = 'person is';
      
    })

    this.socket.on('update_picture', imgData => {
      this.img = imgData;
    })

    this.setupCamera();

  
  }

  updateWidth(val)
  {
    this.socket.emit('width_changed', val)
  }

  async takePhoto()
  {
    const {Camera} = Plugins;
    const result = await Camera.getPhoto({resultType: CameraResultType.DataUrl, quality:100, correctOrientation:true});
    this.img = result.dataUrl;  

    this.socket.emit('picture_added', result.dataUrl);
 
  }

  async setupCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        'audio': true,
        'video': {facingMode: 'environment'}
      });
      
      console.log(stream);
      this.socket.emit('new_stream', stream);
      this.socket.on('stream_sent', _stream => {
        console.log(_stream);
        (<any>window).stream = _stream;
        this.videoElement.nativeElement.srcObject = _stream;
      })
      return new Promise(resolve => {
        this.videoElement.nativeElement.onloadedmetadata = () => {
          resolve([this.videoElement.nativeElement.videoWidth,
              this.videoElement.nativeElement.videoHeight]);
        };
      });
    }
  }
}

export const functions = {
  derp: () => {
    console.log(22);
  },

}
