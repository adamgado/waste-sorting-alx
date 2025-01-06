import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    constructor(private router: Router, private route: ActivatedRoute) { }
    counter: any = {};
    categories: any[] = [];
    products: any[] = []
    material: any[] = [];

    decreaseCounter(i: number) {
        if(this.counter[i] > 0)
            this.counter[i]--;
    }
    increaseCounter(i: number) {
        this.counter[i]++;
    }
    filter(name: string): void {
        if(name === "all") {
            this.material = [...this.products];
            return;
        }
        this.material = this.products.filter((mat) => mat.categoryname === name);
    }

    err: string = ''
    selected: {lat: number, lng: number} | null = null;
    async ngOnInit() {
        this.route.paramMap.subscribe(async(params) => {
            this.selected = {lat: Number(params.get('lat')), lng: Number(params.get('lng'))}
        })
        const res = await fetch('http://localhost:3000/getmaterial');
        const data = await res.json();
        this.products = this.material = data.result;

        this.products.forEach(pro => this.counter[pro.id] = 0);

        const res2 = await fetch('http://localhost:3000/getcategories');
        const data2 = await res2.json();
        this.categories = data2.result;
    }

    async Confirm() {
        const data = Array();
        for (const [key, value] of Object.entries(this.counter)) {
            for(let j = 0; j < Number(value); j++) {
                data.push(Number(key));
            }
        }
        if(data.length === 0) {
            this.err = 'Choose at least one material.';
            return;
        }
        const res = await fetch(`http://localhost:3000/ordermachine`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('WSToken')}`,
            },
            body: JSON.stringify({latitude: this.selected?.lat, longitude: this.selected?.lng, orderList: data})
        });

        if(res.ok) {
            this.router.navigateByUrl('home');
        }
        this.err = (await res.json()).message;

    }
    Discard() {
        if(confirm('are you sure you need to discard?'))
            this.router.navigateByUrl('home');
    }
}


