import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPcAppComponent } from './my-pc-app.component';

describe('MyPcAppComponent', () => {
  let component: MyPcAppComponent;
  let fixture: ComponentFixture<MyPcAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPcAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPcAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
