import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detailsmachine',
  standalone: true,
  imports: [NgIf],
  templateUrl: './detailsmachine.component.html',
  styleUrl: './detailsmachine.component.scss'
})
export class DetailsmachineComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  machine: any;

  async ngOnInit() {
    this.route.paramMap.subscribe(async(params) => {
      this.machine = {};
      this.machine.id = params.get('id');
      
      const res = await fetch('http://localhost:3000/machine?id=' + this.machine.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('WSToken')}`
        }
      });

      if(!res.ok) {
        return;
      }

      const data = await res.json();

      this.machine = data.machine;
    });
  }
  async report() {
    const res = await fetch('http://localhost:3000/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('WSToken')}`
      },
      body: JSON.stringify({id: this.machine.id})
    });
  }
}
