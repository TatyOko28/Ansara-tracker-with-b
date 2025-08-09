export enum Category {
  Today = 'Сегодня',
  Evening = 'Сегодня вечером',
  Tomorrow = 'Завтра',
  Someday = 'Когда-нибудь',
}

export interface Task {
  id: string;
  text: string;
  category: Category;
}

export interface CompletedTask {
  id: string;
  text: string;
  start: string;
  end: string;
  date: string;
}
