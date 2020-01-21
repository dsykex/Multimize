import { Component, ElementRef, ViewChild } from '@angular/core';
import io from 'socket.io-client';
import {CameraResultType, Plugins, CameraSource} from '@capacitor/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import "@ionic/pwa-elements";

declare var speechCommands;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('camera', {static: false}) videoElement: ElementRef;
  @ViewChild('console', {static: false}) console: ElementRef;
  title = 'multi-client';

  socket: any;
  width: number;
  updateVal: number = 1;
  connections: number = 0;

  adj = 'people';

  img: SafeResourceUrl;
  recognizer: any;
  examples=[];
  constructor()
  {
    this.initRezognizer();

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
  }

  collect(label) {
    if (this.recognizer.isListening()) {
      return this.recognizer.stopListening();
    }
    if (label == null) {
      return;
    }
    this.recognizer.listen(async ({spectrogram: {frameSize, data}}) => {
      let vals = this.normalize(data.subarray(-frameSize * 3));
      //console.log(this.examples);
      this.examples.push({vals, label});
      this.console.nativeElement.textContent =
          `${this.examples.length} examples collected`;
    }, {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true
    });
   }

   normalize(x) {
    const mean = -100;
    const std = 10;
    return x.map(x => (x - mean) / std);
   }
  async initRezognizer(){
    this.recognizer = speechCommands.create('BROWSER_FFT');
    await this.recognizer.ensureModelLoaded();
    //this.predictWord();
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
}

export const functions = {
  derp: () => {
    console.log(22);
  },

}
