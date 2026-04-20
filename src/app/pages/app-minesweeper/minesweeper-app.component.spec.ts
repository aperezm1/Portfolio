import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperAppComponent } from './minesweeper-app.component';

describe('MinesweeperAppComponent', () => {
  let component: MinesweeperAppComponent;
  let fixture: ComponentFixture<MinesweeperAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinesweeperAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinesweeperAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
