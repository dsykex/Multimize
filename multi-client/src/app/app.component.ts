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
  width: number;
  updateVal: number = 0.5;
  connections: number = 0;

  adj = 'people';
  constructor()
  {
    this.socket = io('https://mighty-thicket-03422.herokuapp.com/');

    this.socket.on('width_value', val => {
      this.width = val;
    })

    this.socket.on('connections_changed', cons => {
      this.connections = cons;
      if(this.connections > 1 || this.connections == 0)
        this.adj = 'people';
      else
        this.adj = 'person';
      
    })
  }

  updateWidth(val)
  {
    this.socket.emit('width_changed', val)
  }
}
