class Food {
  element: HTMLElement;
  constructor() {
    this.element = document.getElementById('Food')!;
  }
  get X() {
    return this.element.offsetLeft;
  }
  get Y() {
    return this.element.offsetTop;
  }
  change() {
    let left = Math.round(Math.random() * 30) * 10;
    let top = Math.round(Math.random() * 30) * 10;
    this.element.style.left = left + 'px';
    this.element.style.top = top + 'px';
  }
}

class Panel {
  score = 0;
  level = 1;
  scoreEle: HTMLElement;
  levelEle: HTMLElement;
  maxLevel: number;
  scoreToLevelUp: number;
  constructor(maxLevel: number = 10, scoreToLevelUp: number = 10) {
    this.scoreEle = document.getElementById('Score')!;
    this.levelEle = document.getElementById('Level')!;
    this.maxLevel = maxLevel;
    this.scoreToLevelUp = scoreToLevelUp;
  }
  addScore() {
    this.scoreEle.innerText = ++this.score + '';
    if (this.score % this.scoreToLevelUp === 0) {
      this.levelUp();
    }
  }
  levelUp() {
    if (this.level > 10) return;
    this.levelEle.innerText = ++this.level + '';
  }
}

class Snake {
  snakeEle: HTMLElement;
  headEle: HTMLElement;
  bodiesEle: HTMLCollection;
  constructor() {
    this.snakeEle = document.getElementById('Snake')!;
    this.headEle = document.querySelector('#Snake > div')!;
    this.bodiesEle = this.snakeEle.getElementsByTagName('div');
  }
  get X() {
    return this.headEle.offsetLeft;
  }
  get Y() {
    return this.headEle.offsetTop;
  }
  set X(value: number) {
    if (this.X === value) return;
    if (value < 0 || value > 300) {
      throw new Error('game over');
    }
    if (this.bodiesEle[1] && (this.bodiesEle[1] as HTMLElement).offsetLeft === value) {
      value = value > this.X ? this.X - 10 : this.X + 10;
    }
    this.moveBody();
    this.headEle.style.left = value + 'px';
    this.checkBody();
  }
  set Y(value: number) {
    if (this.Y === value) return;
    if (value < 0 || value > 300) {
      throw new Error('game over');
    }
    if (this.bodiesEle[1] && (this.bodiesEle[1] as HTMLElement).offsetTop === value) {
      value = value > this.Y ? this.Y - 10 : this.Y + 10;
    }
    this.moveBody();
    this.headEle.style.top = value + 'px';
    this.checkBody();
  }
  addBody() {
    this.snakeEle.insertAdjacentHTML('beforeend', '<div></div>');
  }
  moveBody() {
    for (let i = this.bodiesEle.length - 1; i > 0; i -= 1) {
      let x = (this.bodiesEle[i - 1] as HTMLElement).offsetLeft;
      let y = (this.bodiesEle[i - 1] as HTMLElement).offsetTop;
      (this.bodiesEle[i] as HTMLElement).style.left = x + 'px';
      (this.bodiesEle[i] as HTMLElement).style.top = y + 'px';
    }
  }
  checkBody() {
    for (let i = 1; i < this.bodiesEle.length; i += 1) {
      const bodyEle = this.bodiesEle[i] as HTMLElement;
      if (this.X === bodyEle.offsetLeft && this.Y === bodyEle.offsetTop) {
        throw new Error('game over');
      }
    }
  }
}

class Control {
  snake: Snake;
  food: Food;
  panel: Panel;
  direction: string = 'ArrowRight';
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.panel = new Panel(10, 3);
    this.init();
  }
  init() {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    this.run();
  }
  keydownHandler(event: KeyboardEvent) {
    this.direction = event.key;
  }
  checkEat(x: number, y: number) {
    if (x !== this.food.X || y !== this.food.Y) return;
    this.food.change();
    this.panel.addScore();
    this.snake.addBody();
  }
  run() {
    let x = this.snake.X;
    let y = this.snake.Y;
    switch (this.direction) {
      case 'ArrowUp':
        y -= 10;
        break;
      case 'ArrowDown':
        y += 10;
        break;
      case 'ArrowLeft':
        x -= 10;
        break;
      case 'ArrowRight':
        x += 10;
        break;
      default:
        break;
    }
    this.checkEat(x, y);
    try {
      this.snake.X = x;
      this.snake.Y = y;
      setTimeout(() => {
        this.run();
      }, 300 - (this.panel.level - 1) * 30);
    } catch (error) {
      alert(error);
    }
  }
}
new Control();