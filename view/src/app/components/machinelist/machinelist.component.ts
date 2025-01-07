import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Machine {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  sorted: boolean;
  estimatedtime: Date;
}
@Component({
  selector: 'app-machinelist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './machinelist.component.html',
  styleUrls: ['./machinelist.component.scss',
    "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
  ]
})
export class MachinelistComponent implements OnInit {
  constructor(private router: Router) { }
  machines: Machine[] = [];
  filtered: Machine[] = [];

  async ngOnInit() {
    const res = await fetch('http://localhost:3000/getAllMachines');

    if(!res.ok) {
      alert('database server error');
      return;
    }

    const data = await res.json();

    this.filtered = this.machines = data.result;

  }

  addMachine() {
    this.router.navigate(['addmachine']);
  }

  editMachine(id: number) {
    this.router.navigate(['editmachine', id]);
  }
  onDetails(id: number) {
    this.router.navigate(['detailsmachine', id]);
  }
  async deleteMachine(id: number) {
    if (confirm('Are you sure you want to delete this machine?')) {
      const res = await fetch(`http://localhost:3000/deletemachine`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('WSToken')}`
        },
        body: JSON.stringify({id})
      });

      const result = await res.json();

      if(!res.ok) {
        alert(result.message);
        return;
      }
      
      this.machines = this.machines.filter(mat => mat.id !== id);
      this.filtered = this.filtered.filter(mat => mat.id !== id);
    }
  }
  async sortMachineMaterial(id: number) {
    if (confirm('do you want to sort this machine?')) {
      const res = await fetch(`http://localhost:3000/sortMachine`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('WSToken')}`
        },
        body: JSON.stringify({id})
      });

      const result = await res.json();

      if(!res.ok) {
        alert(result.message);
        return;
      }
      this.machines.map((machine)=>{
        if(machine.id == id) {
          machine.sorted = true;
        }
      })
    }
  }

onSearch(text: string) {
  this.filtered = this.machines.filter((machine) =>
    machine.name.toLowerCase().includes(text.toLowerCase())
  );
}
}
