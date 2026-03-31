import { pgTable, text, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- NEXT-AUTH REQUIRED TABLES ---
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // bcrypt hash for credentials auth
});

export const accounts = pgTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

// --- TASTEVAULT DATA ---
export const savedRecipes = pgTable("saved_recipes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  mealId: text("mealId").notNull(),     // The API's ID (e.g., "52772")
  title: text("title").notNull(),
  image: text("image"),
  category: text("category"),
  note: text("note"),                   // The user's editable note!
  createdAt: timestamp("created_at").defaultNow(),
});