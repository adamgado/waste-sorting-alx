import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  constructor(private route: Router, private userService: UserService) { }

  user: any = null;
  title = 'Waste Sorting Machine Order History';

  expandedOrderId: number | null = null;

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUser();
    this.userService.data$.subscribe(async(data) => {
      this.user = await this.userService.getUser();
    });
    if(!this.user) {
      this.route.navigate(['/login']);
      return;
    }
    this.orders = this.user.odrers;
    this.orders.sort((a: any, b: any) => {
      return b.id - a.id;
    });
  }


  orders: any = [];

  toggleDetails(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }
}
