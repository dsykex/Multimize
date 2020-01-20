import { Component } from '@angular/core';
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
