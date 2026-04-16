import { EntitySchema } from "typeorm"
export const Product = new EntitySchema({
name: "Product",
tableName: "products",
columns: {
id: { primary: true, type: "int", generated: true },
name: { type: "varchar", length: 100 },
price: { type: "decimal" },
category: { type: "varchar" },
stock: { type: "int" },
created_at: { type: "timestamp", createDate: true }
}
})