import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editmachine',
  standalone: true,
  imports: [GoogleMapsModule, NgIf],
  templateUrl: './editmachine.component.html',
  styleUrl: './editmachine.component.scss'
})
export class EditmachineComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) { }
  center: google.maps.LatLngLiteral = { lat: 30.0444, lng: 31.2357 };
  zoom = 12;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDefaultUI: false,
  };
  machine: any = {};
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

      this.selectedPlace = {
        lat: +this.machine.latitude,
        lng: +this.machine.longitude,
      };
      this.center = {
        lat: +this.machine.latitude,
        lng: +this.machine.longitude,
      };
    });
  }

  selectedPlace: { lat: number; lng: number } | null = null;

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.selectedPlace = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    }
  }
      
  err: string = '';
  async onSubmit(event: Event) {
    event.preventDefault();

    let name = (document.getElementById('machineName') as HTMLSelectElement).value;
    // if(name === this.machine.name)
    //   name = '';
    const state = (document.getElementById('status') as HTMLSelectElement).value;

    const data = { id: this.machine.id, name, latitude: this.selectedPlace?.lat, longitude: this.selectedPlace?.lng, state }

    const res = await fetch(`http://localhost:3000/editmachine`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('WSToken')}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if(!res.ok) {
      this.err = result.message;
      return;
    }
    this.router.navigate(['machinelist']);
  }
}



