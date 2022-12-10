interface CaffeeOrder {
    coffee: String;
    quantity: number;
}

interface Order  {
    id: String;
    coffee: Array<CaffeeOrder>;
    totalPrice: number;
    username: String
}

export = Order