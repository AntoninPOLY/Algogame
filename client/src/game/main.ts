import Phaser from 'phaser'
import  GameScene  from "./scenes/GameScene";

function launch(id:string) {
  const scaleRatio: number = window.devicePixelRatio / 3;
  const width = 1280 * scaleRatio
  const height = 780 * scaleRatio
  console.log(width, height)

  const config = {
    type: Phaser.CANVAS,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      }
    },
    scale: {
      width,
      height,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: id,
      mode: Phaser.Scale.RESIZE,
    },
    scene: [GameScene],
  }

  return new Phaser.Game(config);
}


export default launch
