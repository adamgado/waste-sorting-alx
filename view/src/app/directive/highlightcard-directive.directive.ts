import { Directive, ElementRef, HostListener, Input, input } from '@angular/core';

@Directive({
  selector: '[appHighlightcard]',
  standalone: true
})
export class HighlightcardDirective {

@Input() externalcolor : string ='black'


  constructor(private ele:ElementRef) {
   this.ele.nativeElement.style.background = 'gray'
  }

 @HostListener('mouseover') over(){
    this.ele.nativeElement.style.background = this.externalcolor;

  }

 @HostListener('mouseout') aut(){
    this.ele.nativeElement.style.background = 'gray'

  }

}
