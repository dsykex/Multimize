import { Component } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'multi-client';
  port: number = 0;
  socket: any;
  width: number = 100;
  updateVal: number = 5;
  constructor()
  {
    this.socket = io('http://localhost:5000');

    this.socket.on('con_msg', msg => {
      this.port = msg;
    })
  }

  updateWidth(val)
  {
    this.width += val;
  }
}
