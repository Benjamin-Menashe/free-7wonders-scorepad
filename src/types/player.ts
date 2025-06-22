
import { WonderBoard, WonderSide } from './game';

export interface Player {
  id: string;
  name: string;
  wonderBoard: WonderBoard;
  wonderSide: WonderSide;
}
