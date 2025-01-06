import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GoogleMapsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) { }
  map!: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  socket: any = new WebSocket('ws://localhost:8080');
  routeCoordinates: any;
  markers: { id: number; marker: google.maps.Marker }[] = [];
  selected: { lat: number; lng: number } | null = null; // Stores the selected point

  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(`Geolocation error: ${error.message}`);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const curr = await this.getCurrentLocation();
    const mapOptions = {
      center: curr,
      zoom: 12,
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );

    
    this.selected = {lat: curr.lat, lng: curr.lng};
    this.addTemporaryMarker(this.selected);

    const res = await fetch('http://localhost:3000/getAllMachines');

    if (!res.ok) {
      return;
    }

    const data = await res.json();

    data.result.forEach((machine: any) => {
      this.addMarker(
        machine.id,
        { lat: +machine.latitude, lng: +machine.longitude },
        machine.name,
        machine.state === 'on'
          ? 'green'
          : machine.state === 'off'
          ? 'red'
          : machine.state === 'maintenance'
          ? 'blue'
          : 'orange'
      );
    });

    this.socket.addEventListener('message', (event: any) => {
      const machine = JSON.parse(event.data);
      if (machine.type !== 'insert') {
        this.markers.forEach((marker: any) => {
          if (marker.id == +machine.id) {
            marker.marker.setMap(null);
          }
        });
        this.markers = this.markers.filter(
          (marker) => marker.id != +machine.id
        );
      }
      if (machine.type !== 'delete') {
        this.addMarker(
          +machine.id,
          { lat: +machine.latitude, lng: +machine.longitude },
          machine.name,
          machine.state === 'on'
            ? 'green'
            : machine.state === 'off'
            ? 'red'
            : machine.state === 'maintenance'
            ? 'blue'
            : 'orange'
        );
      }
    });

    // Add a listener for map clicks to select a point
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;

      if (latLng) {
        this.selected = { lat: latLng.lat(), lng: latLng.lng() };
        this.addTemporaryMarker(this.selected);
      }
    });
  }

  addMarker(
    id: number,
    position: { lat: number; lng: number },
    note: string,
    color: string
  ) {
    const customIcon = {
      url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      scaledSize: new google.maps.Size(40, 40),
    };

    const marker = new google.maps.Marker({
      map: this.map,
      position: position,
      icon: customIcon,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black; font-size: 14px;">${note}</div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.push({ id, marker });
  }

  // Add a temporary marker for the selected point
  addTemporaryMarker(position: { lat: number; lng: number }) {
    // Remove any existing temporary marker
    this.markers.forEach((marker) => {
      if (marker.id === -1) marker.marker.setMap(null);
    });

    const customIcon = {
      url: `http://maps.google.com/mapfiles/ms/icons/yellow-dot.png`,
      scaledSize: new google.maps.Size(40, 40),
    };

    const marker = new google.maps.Marker({
      map: this.map,
      position: position,
      icon: customIcon,
    });

    this.markers.push({ id: -1, marker }); // -1 is the ID for temporary markers
  }

  err: string = '';
  async call() {
    this.err = ''
    if (!this.selected) {
      this.err = 'Please select a point on the map.';
      return;
    }
    this.router.navigateByUrl(`products/${this.selected.lat}/${this.selected.lng}`);
  }
}
