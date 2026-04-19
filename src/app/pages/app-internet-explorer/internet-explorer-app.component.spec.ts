import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetExplorerAppComponent } from './internet-explorer-app.component';

describe('InternetExplorerAppComponent', () => {
  let component: InternetExplorerAppComponent;
  let fixture: ComponentFixture<InternetExplorerAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternetExplorerAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternetExplorerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
