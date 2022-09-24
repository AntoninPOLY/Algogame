import { Room, Client } from "@colyseus/core";
import { AlgoState, Player, Card } from './schema/AlgoState'

export class AlgoRoom extends Room<AlgoState> {
  maxClients = 2;

  onCreate(options: any) {
    console.log("AlgoRoom created.");
    this.setState(new AlgoState());

    this.onMessage("card-played", (client, data) => {
      console.log("update received -> ");
      console.debug(JSON.stringify(data));
      const player = this.state.players.get(client.sessionId);
      const card = new Card();

      this.state.cards.push(card)

      card.cardId = data.cardId
      card.player = player.id
    });
  }

  onAuth(client: Client, options: any) {
    console.debug(options)
    return true
  }

  onJoin(client: Client, options: any) {
    console.log(options.name, "joined!");

    // create Player instance
    const player = new Player();

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);

    if(this.state.players.size === 1) {
      player.id = 1
    } else {
      player.id = 2
    }

    console.log("new player =>", player.toJSON());
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
