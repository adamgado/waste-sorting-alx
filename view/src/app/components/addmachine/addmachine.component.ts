import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addmachine',
  standalone: true,
  imports: [GoogleMapsModule, NgIf],
  templateUrl: './addmachine.component.html',
  styleUrls: ['./addmachine.component.scss', 
    "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
  ]
})
export class AddmachineComponent {
  constructor(private router: Router) { }
  center: google.maps.LatLngLiteral = { lat: 30.0444, lng: 31.2357 };
  zoom = 15;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDefaultUI: false,
  };

  selectedPlace: { lat: number; lng: number } | null = null;

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.selectedPlace = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      console.log('Selected Coordinates:', this.selectedPlace);
    }
  }

  err: string = '';
  async onSubmit(event: Event) {
    event.preventDefault();

    const name = (document.getElementById('machineName') as HTMLSelectElement).value;
    const data = {name, latitude: this.selectedPlace?.lat, longitude: this.selectedPlace?.lng};

    const res = await fetch('http://localhost:3000/addmachine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('WSToken')}`
      },
      body: JSON.stringify(data)
    })

    const out = await res.json();

    if(!res.ok) {
      this.err = out.message;
      return;
    }

    this.router.navigate(['machinelist']);
  }


/////////////////////////////////////////////////////////////////////////////////////////////////
}
