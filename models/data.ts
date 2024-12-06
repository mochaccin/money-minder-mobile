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

export const mockCards: MockCard[] = [
  {
    _id: { $oid: "673a6dc7b51c964eefdbe538" },
    owner: { $oid: "66b6f687ba562c138887ac1c" },
    card_name: "Tenpo",
    card_type: true,
    card_number: "4235 2354 1923 2942",
    card_expiration_date: "13/04/2024",
    card_cvv: "295",
    spends: [
      {
        name: "Grocery Store",
        date: "14/02/24",
        category: "Food",
        amount: 5555,
        owner: { $oid: "66b6f687ba562c138887ac1c" },
        payment_card: { $oid: "673a6dc7b51c964eefdbe538" }
      },
      {
        name: "Movie Tickets",
        date: "15/02/24",
        category: "Entertainment",
        amount: 2000,
        owner: { $oid: "66b6f687ba562c138887ac1c" },
        payment_card: { $oid: "673a6dc7b51c964eefdbe538" }
      },
      {
        name: "Gas Station",
        date: "16/02/24",
        category: "Transport",
        amount: 3500,
        owner: { $oid: "66b6f687ba562c138887ac1c" },
        payment_card: { $oid: "673a6dc7b51c964eefdbe538" }
      },
      {
        name: "Online Shopping",
        date: "17/02/24",
        category: "Shopping",
        amount: 7000,
        owner: { $oid: "66b6f687ba562c138887ac1c" },
        payment_card: { $oid: "673a6dc7b51c964eefdbe538" }
      },
      {
        name: "Restaurant",
        date: "18/02/24",
        category: "Food",
        amount: 4500,
        owner: { $oid: "66b6f687ba562c138887ac1c" },
        payment_card: { $oid: "673a6dc7b51c964eefdbe538" }
      }
    ]
  },
  {
    _id: { $oid: "673a6dc7b51c964eefdbe539" },
    owner: { $oid: "66b6f687ba562c138887ac1c" },
    card_name: "Visa",
    card_type: false,
    card_number: "4111 1111 1111 1111",
    card_expiration_date: "01/01/2025",
    card_cvv: "123",
    spends: []
  },
  {
    _id: { $oid: "673a6dc7b51c964eefdbe540" },
    owner: { $oid: "66b6f687ba562c138887ac1c" },
    card_name: "Mastercard",
    card_type: true,
    card_number: "5555 5555 5555 4444",
    card_expiration_date: "01/01/2026",
    card_cvv: "321",
    spends: []
  }
];

