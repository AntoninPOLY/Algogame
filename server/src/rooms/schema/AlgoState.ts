import { MapSchema, ArraySchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("number") id: number;
}

export class Card extends Schema {
    @type("number") cardId: number;
    @type("number") player: number;
}

export class AlgoState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([ Card ]) cards = new ArraySchema<Card>();
}
