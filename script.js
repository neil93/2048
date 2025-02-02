class Game {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.bgMusic = document.getElementById('bgMusic');
        this.bgMusicAfter500 = document.getElementById('bgMusicAfter500');
        this.bgMusicAfter1098 = document.getElementById('bgMusicAfter1098');
        this.bgMusicAfter1400 = document.getElementById('bgMusicAfter1400');
        this.has500ScoreTriggered = false;
        this.has1098ScoreTriggered = false;
        this.has1400ScoreTriggered = false;
        this.isMusicOn = true;
        this.touchStartX = null;
        this.touchStartY = null;
        this.init();
        this.initAudio();
        this.initMusicToggle();
        this.initTouchEvents();
    }

    init() {
        // 初始化遊戲
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    initAudio() {
        // 當使用者第一次點擊時開始播放音樂
        document.addEventListener('click', () => {
            if (!this.bgMusic.playing) {
                this.bgMusic.play();
            }
        }, { once: true });
    }

    initMusicToggle() {
        const musicToggleButton = document.getElementById('musicToggleButton');
        musicToggleButton.addEventListener('click', () => {
            this.toggleMusic();
        });
    }

    toggleMusic() {
        this.isMusicOn = !this.isMusicOn;
        const musicToggleButton = document.getElementById('musicToggleButton');
        
        if (this.isMusicOn) {
            musicToggleButton.textContent = '🔊';
            if (this.has1400ScoreTriggered) {
                this.bgMusicAfter1400.play();
            } else if (this.has1098ScoreTriggered) {
                this.bgMusicAfter1098.play();
            } else if (this.has500ScoreTriggered) {
                this.bgMusicAfter500.play();
            } else {
                this.bgMusic.play();
            }
        } else {
            musicToggleButton.textContent = '🔈';
            this.bgMusic.pause();
            this.bgMusicAfter500.pause();
            this.bgMusicAfter1098.pause();
            this.bgMusicAfter1400.pause();
        }
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        const oldGrid = JSON.stringify(this.grid);

        switch(direction) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                alert('遊戲結束！您的分數是：' + this.score);
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) {
                row.push(0);
            }
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            this.grid[i] = row;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) {
                row.unshift(0);
            }
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            this.grid[i] = row;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (column.length < 4) {
                column.push(0);
            }
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                }
            }
            while (column.length < 4) {
                column.unshift(0);
            }
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    isGameOver() {
        // 檢查是否還有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // 檢查是否有相鄰的相同數字
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) return false;
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }

        return true;
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = this.grid[row][col];
            cell.textContent = value || '';
            cell.dataset.value = value || '';
        });

        document.getElementById('score').textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        document.getElementById('bestScore').textContent = this.bestScore;

        // 檢查分數達到特定值時的觸發
        if (this.score >= 1400 && !this.has1400ScoreTriggered) {
            this.trigger1400Score();
        } else if (this.score >= 1098 && !this.has1098ScoreTriggered) {
            this.trigger1098Score();
        } else if (this.score >= 500 && !this.has500ScoreTriggered) {
            this.trigger500Score();
        }
    }

    trigger500Score() {
        this.has500ScoreTriggered = true;
        
        // 切換背景圖片
        document.body.style.setProperty('--bg-image', 'url("./images/sans-battle.jpg")');
        
        // 只有在音樂開啟時才切換音樂
        if (this.isMusicOn) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.bgMusicAfter500.play();
        }
    }

    trigger1098Score() {
        this.has1098ScoreTriggered = true;
        
        // 切換背景圖片到 gaster
        document.body.style.setProperty('--bg-image', 'url("./images/gaster.jpg")');
        
        // 切換到 Gaster 主題音樂
        if (this.isMusicOn) {
            this.bgMusic.pause();
            this.bgMusicAfter500.pause();
            this.bgMusic.currentTime = 0;
            this.bgMusicAfter500.currentTime = 0;
            this.bgMusicAfter1098.play();
        }
    }

    trigger1400Score() {
        this.has1400ScoreTriggered = true;
        
        // 切換背景圖片
        document.body.style.setProperty('--bg-image', 'url("./images/your-1400-image.jpg")');
        
        // 切換音樂
        if (this.isMusicOn) {
            this.bgMusic.pause();
            this.bgMusicAfter500.pause();
            this.bgMusicAfter1098.pause();
            this.bgMusic.currentTime = 0;
            this.bgMusicAfter500.currentTime = 0;
            this.bgMusicAfter1098.currentTime = 0;
            this.bgMusicAfter1400.play();
        }
    }

    // 修改重置函數
    reset() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.has500ScoreTriggered = false;
        this.has1098ScoreTriggered = false;
        this.has1400ScoreTriggered = false;
        
        // 重置背景
        document.body.style.setProperty('--bg-image', 'url("./images/sans-undertale-550x309.jpg")');
        
        // 重置音樂
        if (this.isMusicOn) {
            this.bgMusicAfter500.pause();
            this.bgMusicAfter1098.pause();
            this.bgMusicAfter1400.pause();
            this.bgMusicAfter500.currentTime = 0;
            this.bgMusicAfter1098.currentTime = 0;
            this.bgMusicAfter1400.currentTime = 0;
            this.bgMusic.play();
        }

        this.init();
    }

    initTouchEvents() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.touchStartX || !this.touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;

            // 最小滑動距離，避免誤觸
            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 水平滑動
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.move('ArrowRight');
                    } else {
                        this.move('ArrowLeft');
                    }
                }
            } else {
                // 垂直滑動
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.move('ArrowDown');
                    } else {
                        this.move('ArrowUp');
                    }
                }
            }

            // 重置觸控起始點
            this.touchStartX = null;
            this.touchStartY = null;
        }, { passive: true });

        // 防止觸控時頁面滾動
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// 初始化遊戲
let game = new Game();

// 監聽鍵盤事件
document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        game.move(event.key);
    }
});

// 監聽新遊戲按鈕
document.getElementById('newGameButton').addEventListener('click', () => {
    game.reset();
    game = new Game();
}); 