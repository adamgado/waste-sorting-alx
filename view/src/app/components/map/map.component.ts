import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, NgIf],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', 
    "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
  ]
})
export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt
  zoom = 12;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDefaultUI: false,
  };

  selectedPlace: { lat: number; lng: number } | null = null;

  // Handle map click event
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.selectedPlace = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      console.log('Selected Coordinates:', this.selectedPlace);
    }
  }
}
