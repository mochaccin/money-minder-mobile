export interface Spend {
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
  
  export interface Card {
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
    spends: Spend[];
  }
  
  export const mockCards: Card[] = [
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
          name: "Coca cola",
          date: "14/02/24",
          category: "insumos",
          amount: 5555,
          owner: { $oid: "66b6f687ba562c138887ac1c" },
          payment_card: { $oid: "000000000000000000000000" }
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
  