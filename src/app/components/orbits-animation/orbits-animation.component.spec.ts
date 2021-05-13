import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitsAnimationComponent } from './orbits-animation.component';

describe('orbitsAnimationComponent', () => {
  let component: OrbitsAnimationComponent;
  let fixture: ComponentFixture<OrbitsAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrbitsAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrbitsAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
