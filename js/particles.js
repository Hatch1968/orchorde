Blood = {
  maxParts : 1000,
  partsPerSplatter : 10,
  container : null,
  sprites : [],
  discardedSprites : [],
  gravity : 100,
  spraySpeed : 20,
  fadeSpeed : 0.2,
	getTexture() {
		var blast = document.createElement('canvas');
		blast.width = 1;
		blast.height = 1;
		var blastCtx = blast.getContext('2d');

		// draw shape
		blastCtx.fillStyle = "#ff0000";
		blastCtx.fillRect(0, 0, 1, 1);
		return PIXI.Texture.from(blast);
	},
	initialize() {

    this.container = new PIXI.Container();
    backgroundContainer.addChild(this.container);

    this.texture = this.getTexture();

		for (var i = 0; i < this.maxParts; i++) {

      var sprite = new PIXI.Sprite(this.texture);
      this.container.addChild(sprite);
      sprite.visible=false;
      this.sprites.push(sprite);
    }
    this.discardedSprites = this.sprites.slice();
	},
	update(timeDiff) {
		for (var i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
      }
		}
  },
  updatePart(sprite, timeDiff) {
    if (sprite.hitFloor) {
      sprite.alpha -= this.fadeSpeed * timeDiff;
      if (sprite.alpha <= 0) {
        sprite.visible = false;
        this.discardedSprites.push(sprite);
      }
    } else {
      sprite.ySpeed += this.gravity * timeDiff;
      sprite.x += sprite.xSpeed * timeDiff;
      sprite.y += sprite.ySpeed * timeDiff;
      if (sprite.y >= sprite.floor) {
        sprite.hitFloor = true;
      }
    }
    
  },
  newPart(x,y) {
    if (this.discardedSprites.length > 0) {
      var sprite = this.discardedSprites.pop();
      sprite.x = x;
      sprite.y = y - (8 + Math.random() * 10);
      sprite.floor = y;
      sprite.hitFloor = false;
      sprite.visible = true;
      sprite.alpha = 1;
      sprite.scale = {x:1,y:1};
      if (Math.random() > 0.5)
        sprite.scale = {x:2,y:2};
      var xSpeed = Math.random() * this.spraySpeed;
      sprite.xSpeed = Math.random() > 0.5 ? -1 * xSpeed : xSpeed;
      sprite.ySpeed = -1 * this.spraySpeed;
    }
  },
  newSplatter(x,y) {
    for (var i=0; i<this.partsPerSplatter; i++) {
      this.newPart(x,y);
    }
  }
};

Tombstones = {
  initialize() {

  },
  newTombstone(x,y) {

  }
};

Exclamations = {
  sprites : [],
  discardedSprites : [],
  maxSprites : 20,
  container:null,
  texture:null,
  height:20,
  displayTime:2,
  fadeSpeed:4,

  initialize() {
    this.container = new PIXI.Container();
    characterContainer.addChild(this.container);

    this.texture = PIXI.Texture.from("exclamation.png");

		for (var i = 0; i < this.maxSprites; i++) {

      var sprite = new PIXI.Sprite(this.texture);
      this.container.addChild(sprite);
      sprite.visible=false;
      sprite.anchor = {x:0.5,y:1};
      this.sprites.push(sprite);
    }
    this.discardedSprites = this.sprites.slice();
  },

  newExclamation(target) {
    if (this.discardedSprites.length > 0) {
      var sprite = this.discardedSprites.pop();
      sprite.target = target;
      sprite.x = target.x;
      sprite.y = target.y - this.height;
      sprite.visible = true;
      sprite.time = this.displayTime;
      sprite.alpha = 1;
      sprite.scale = {x:1.5,y:1.5};
    }
  },

  update(timeDiff) {
    for (var i=0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updateSprite(this.sprites[i], timeDiff);
      }
    }
  },

  updateSprite(sprite, timeDiff) {
    sprite.x = sprite.target.x;
    sprite.y = sprite.target.y - this.height;
    sprite.zIndex = sprite.target.y;
    sprite.time -= timeDiff;
    if (sprite.time < 0) {
      sprite.alpha -= timeDiff * this.fadeSpeed;
      if (sprite.alpha < 0) {
        sprite.visible = false;
        this.discardedSprites.push(sprite);
      }
    }
  }
};