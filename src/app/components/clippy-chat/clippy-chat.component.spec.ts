import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClippyChatComponent } from './clippy-chat.component';

describe('ClippyChatComponent', () => {
  let component: ClippyChatComponent;
  let fixture: ComponentFixture<ClippyChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClippyChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClippyChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
