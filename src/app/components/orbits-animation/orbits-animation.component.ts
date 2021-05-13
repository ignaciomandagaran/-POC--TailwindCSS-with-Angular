import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-orbits-animation',
  templateUrl: './orbits-animation.component.html',
  styleUrls: ['./orbits-animation.component.scss']
})
export class OrbitsAnimationComponent implements OnInit {

  @Input()
  darkmode = false;

  constructor() { }

  ngOnInit(): void {}

}
