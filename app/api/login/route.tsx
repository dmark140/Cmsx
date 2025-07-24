import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

  const [rows]: any = await connection.execute(
    "SELECT * FROM OUSR WHERE user = ? AND pass = ? LIMIT 1",
    [email, password]
  );

  await connection.end();

  if (rows.length > 0) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }
}
