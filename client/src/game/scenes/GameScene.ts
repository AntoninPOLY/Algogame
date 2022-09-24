import tinymagician from '../assets/M7S_Tiny Magician_276312047.jpeg'
import mirrorskeleton from '../assets/M3A_Mirror Skeleton_252401436.jpeg'

import * as Colyseus from 'colyseus.js'

export default class GameScene extends Phaser.Scene {

  private scaleRatio: number = window.devicePixelRatio / 3;
  private vWidth = 1280
  private vHeight = 780
  private room: Colyseus.Room

  public isPlayer1: boolean = false

  private opponentsCards: any[] = []
  private playerName: string

  private dropZone: Phaser.GameObjects.Zone

  init() {
    this.cameras.main.setBackgroundColor("#24252A");
    this.playerName = this.game.name
  }

  preload() {
    this.load.image('TinyMagician', tinymagician)
    this.load.image('MirrorSkeleton', mirrorskeleton)
  }

  async create() {

    const client = new Colyseus.Client('ws://localhost:3000');


    try {
        this.room = await client.joinOrCreate("AlgoRoom", {
        name: this.playerName
      })

      this.room.state.players.onAdd = (player: any, sessionId: any) => {
        const isCurrentPlayer = sessionId === this.room.sessionId
        if(isCurrentPlayer && player.id === 1) {
          this.isPlayer1 = true
        }

        this.dealCards(player.id, isCurrentPlayer);

      }

      this.room.state.cards.onAdd = (card: any, sessionId: any) => {
        if (card.player === 1 !== this.isPlayer1) {
                const sprite = card.player === 1 ? 'TinyMagician' : 'MirrorSkeleton'
                this.opponentsCards[card.cardId].destroy();
                this.dropZone.data.values.cards++;

                const posx = (this.dropZone.x - 350) + ((this.dropZone.data.values.cards - 1) * 130)
                const cardSprite = this.createCard(posx, this.dropZone.y, sprite)
                cardSprite.disableInteractive();
                console.log(cardSprite)
            }

      }

      console.log(this.room.sessionId, "joined", this.room.name);
      console.log(await this.room.state.players)

    } catch(e) {
      console.log(e)
    }

    this.input.on('drag',  (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    })

    this.input.on('dragstart',  (pointer, gameObject) => {
      gameObject.setTint(0xff69b4);
      this.children.bringToTop(gameObject);
    })

    this.input.on('dragend',  (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    })

    this.input.on('drop',  (pointer, gameObject, dropZone) => {
      dropZone.data.values.cards++;
      gameObject.x = (dropZone.x - 350) + ((dropZone.data.values.cards - 1) * 130);
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
      this.room.send('card-played', {cardId: gameObject.id})
      console.log('sent')
    })

    this.createDropZone()
    this.renderOutlineZone()
  }

  private dealCards = (id: number, isCurrentPlayer: boolean) => {
    for (let i = 0; i < 5; i++) {
      const card: any = this.createCard(375 + (i * 100), isCurrentPlayer ? 550 : 100, id === 1 ? 'TinyMagician' : 'MirrorSkeleton')
      card.id = i
      if(!isCurrentPlayer) this.opponentsCards.push(card)
    }

  }

  private createCard = (x: number, y:number , spriteName: string) => {
    const card = this.add.image(
      x,
      y,
      spriteName,
    );

    card.scale = 0.05
    card.setInteractive()
    this.input.setDraggable(card)
    return card
  }

  private createDropZone = (): Phaser.GameObjects.Zone => {
    this.dropZone = this.add.zone(600, 325, 900, 250).setRectangleDropZone(900, 250);
    this.dropZone.setData({ cards: 0 });
  }

  private renderOutlineZone = () => {
    const dropZoneOutline = this.add.graphics();
    dropZoneOutline.lineStyle(4, 0xff69b4);
    dropZoneOutline.strokeRect(
      this.dropZone.x - this.dropZone.input.hitArea.width / 2,
      this.dropZone.y - this.dropZone.input.hitArea.height / 2,
      this.dropZone.input.hitArea.width,
      this.dropZone.input.hitArea.height);
      return true
    }
  }
