import { Component } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'multi-client';

  socket: any;
  width: number = 50;
  updateVal: number = 5;
  constructor()
  {
    this.socket = io('https://mighty-thicket-03422.herokuapp.com/');

    this.socket.on('width_value', val => {
      this.width = val;
    })
  }

  updateWidth(val)
  {
    this.socket.emit('width_changed', val)
  }
}
