import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpTaskbarComponent } from './xp-taskbar.component';

describe('XpTaskbarComponent', () => {
  let component: XpTaskbarComponent;
  let fixture: ComponentFixture<XpTaskbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XpTaskbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpTaskbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
