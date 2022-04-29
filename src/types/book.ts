import { GeoPoint } from "firebase/firestore";
import React from "react";
import { UserType } from "./generalTypes";

export type BookType = {
  id: string;
  title: string;
  author: string;
  published: number;
  comment: string;
  position: GeoPoint;
  geohash?: string;
  borrowed: boolean;
  ownership: boolean;
  borrowedBy: string;
  prevBorrowedId?: string;
  ownerId: string;
  userId: string;
  borrowedDate: string;
};

export type KeyBookObjectType = {
  [key: string]: booklistType;
};

type booklistType = {
  books: Array<BookType>;
};

export type RouteType = {
  component: React.ComponentType<any>;
  header: string;
  back: boolean;
};

export interface MatchParams {
  title?: string;
  id?: string;
}

export type BreadCrumbType = {
  [key: string]: RouteType;
};

export interface KeyObjectType {
  [key: string]: boolean;
}
