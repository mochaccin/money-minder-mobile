export interface Card {
  id?: string;
  owner: string;
  card_name: string;
  card_type: boolean;
  card_number: string;
  card_expiration_date: string;
  card_cvv: string;
  spends?: Spend[];
}

export interface Spend {
  id?: string;
  name: string;
  date: string;
  category: string;
  amount: number;
  owner: string;
  payment_card: string;
}

export interface User {
  name: string;
  password: string;
  cards?: Spend[];
  spends?: Spend[];
}

export interface MockSpend {
  name: string;
  date: string;
  category: string;
  amount: number;
  owner: {
    $oid: string;
  };
  payment_card: {
    $oid: string;
  };
}

export interface MockCard {
  _id: {
    $oid: string;
  };
  owner: {
    $oid: string;
  };
  card_name: string;
  card_type: boolean;
  card_number: string;
  card_expiration_date: string;
  card_cvv: string;
  spends: MockSpend[];
}