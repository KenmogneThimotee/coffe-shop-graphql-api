interface CaffeeCommand {
    coffee: String;
    quantity: number;
}

interface Command  {
    id: String;
    coffee: Array<CaffeeCommand>;
    totalPrice: number;
    username: String
}

export = Command