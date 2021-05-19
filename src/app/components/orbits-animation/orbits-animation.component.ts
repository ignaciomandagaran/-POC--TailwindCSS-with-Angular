import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-orbits-animation',
  templateUrl: './orbits-animation.component.html',
  styleUrls: ['./orbits-animation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrbitsAnimationComponent implements OnInit {

  @Input()
  darkmode = false;

  constructor() {}

  ngOnInit(): void {}

}
