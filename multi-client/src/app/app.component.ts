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

  constructor()
  {
    this.socket = io('http://localhost:7714');

    this.socket.on('port', port => {
      this.port = port;
    })
  }
}
