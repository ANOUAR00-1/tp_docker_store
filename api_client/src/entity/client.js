import { EntitySchema } from "typeorm"
export const Client = new EntitySchema({
 name: "Client",
 tableName: "clients",
 columns: {
  id: { primary: true, type: "int", generated: true },
  name: { type: "varchar", length: 100 },
  email: { type: "varchar", length: 100 },
  created_at: { type: "timestamp", createDate: true }
 }
})