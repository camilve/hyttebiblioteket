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
  ownerId: string;
  userId: string;
};

export type KeyBookObjectType = {
  [key: string]: booklistType;
};

type booklistType = {
  books: Array<BookType>;
};

export type RouteType = {
  path: string;
  component: React.ComponentType<any>;
  crumbTransform: (match: MatchParams) => string;
};

interface MatchParams {
  name?: string;
  id?: string;
}

export type BreadCrumbType = {
  [key: string]: RouteType;
};

export interface KeyObjectType {
  [key: string]: boolean;
}