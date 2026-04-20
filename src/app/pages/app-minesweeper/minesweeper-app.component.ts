import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

@Component({
  selector: 'app-minesweeper-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minesweeper-app.component.html',
  styleUrls: ['./minesweeper-app.component.scss'],
})
export class MinesweeperAppComponent implements OnInit {
  rows = 9;
  cols = 9;
  mineCount = 10;

  board: Cell[][] = [];
  gameOver = false;
  win = false;
  firstClickDone = false;
  flagsLeft = this.mineCount;
  revealedSafeCells = 0;

  timer = 0;
  private timerId: number | undefined;

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      }))
    );
    this.gameOver = false;
    this.win = false;
    this.firstClickDone = false;
    this.flagsLeft = this.mineCount;
    this.revealedSafeCells = 0;
    this.timer = 0;
    this.stopTimer();
    this.placeMines();
    this.calculateAdjacents();
  }

  onCellLeftClick(r: number, c: number): void {
    if (this.gameOver || this.win) return;
    const cell = this.board[r][c];
    if (cell.revealed || cell.flagged) return;

    if (!this.firstClickDone) {
      this.firstClickDone = true;
      this.startTimer();
      if (cell.mine) {
        this.relocateMineFrom(r, c);
        this.calculateAdjacents();
      }
    }

    if (cell.mine) {
      cell.revealed = true;
      this.revealAllMines();
      this.stopTimer();
      this.gameOver = true;
      return;
    }

    this.revealFlood(r, c);
    this.checkWin();
  }

  onCellRightClick(event: MouseEvent, r: number, c: number): void {
    event.preventDefault();
    if (this.gameOver || this.win) return;
    const cell = this.board[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    this.flagsLeft += cell.flagged ? -1 : 1;
  }

  face(): string {
    if (this.gameOver) return '😵';
    if (this.win) return '😎';
    return '🙂';
  }

  cellText(cell: Cell): string {
    if (!cell.revealed) return cell.flagged ? '🚩' : '';
    if (cell.mine) return '💣';
    return cell.adjacent > 0 ? String(cell.adjacent) : '';
  }

  cellClass(cell: Cell): string {
    if (!cell.revealed) return 'hidden';
    if (cell.mine) return 'mine';
    return cell.adjacent > 0 ? `n${cell.adjacent}` : 'empty';
  }

  get formattedTimer(): string {
    return String(this.timer).padStart(3, '0');
  }

  private startTimer(): void {
    if (this.timerId) return;
    this.timerId = window.setInterval(() => {
      if (this.timer < 999) this.timer++;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private placeMines(): void {
    let placed = 0;
    while (placed < this.mineCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (this.board[r][c].mine) continue;
      this.board[r][c].mine = true;
      placed++;
    }
  }

  private relocateMineFrom(r0: number, c0: number): void {
    this.board[r0][c0].mine = false;
    while (true) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.board[r][c].mine && (r !== r0 || c !== c0)) {
        this.board[r][c].mine = true;
        break;
      }
    }
  }

  private calculateAdjacents(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].mine) {
          this.board[r][c].adjacent = 0;
          continue;
        }
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if (this.board[nr][nc].mine) count++;
          }
        }
        this.board[r][c].adjacent = count;
      }
    }
  }

  private revealFlood(sr: number, sc: number): void {
    const stack: Array<[number, number]> = [[sr, sc]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      const cell = this.board[r][c];
      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;
      if (!cell.mine) this.revealedSafeCells++;
      if (cell.adjacent !== 0) continue;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
          if (!this.board[nr][nc].revealed) stack.push([nr, nc]);
        }
      }
    }
  }

  private revealAllMines(): void {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.mine) cell.revealed = true;
      }
    }
  }

  private checkWin(): void {
    const safeCells = this.rows * this.cols - this.mineCount;
    if (this.revealedSafeCells === safeCells) {
      this.win = true;
      this.stopTimer();
    }
  }
}