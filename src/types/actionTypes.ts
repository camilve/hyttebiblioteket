import { PositionType } from "./generalTypes";

export type BooksActionType = {
  selectedTable?: number;
  type: string;
};

export type PositionActionType = {
  position?: PositionType;
  type: string;
};
