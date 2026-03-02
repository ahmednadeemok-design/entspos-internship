// ES6 Class + static methods
export class Product {
  constructor({ id, name, price, category = "General" }) {
    if (!id || !name) throw new Error("Product requires id and name");
    if (typeof price !== "number" || price < 0) throw new Error("Invalid price");

    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }

  // instance method
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
    };
  }

  // static method: create from plain object
  static from(obj) {
    return new Product(obj);
  }

  // static method: validate product
  static isValid(obj) {
    return (
      obj &&
      typeof obj.id === "string" &&
      typeof obj.name === "string" &&
      typeof obj.price === "number" &&
      obj.price >= 0
    );
  }
}