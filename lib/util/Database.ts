// This module allows for developers to switch between using vercel
// as their PostgreSQL provider, and hosting their own PostgreSQL 
// database. 
import pg from 'pg';
import { sql as sqlVercel } from '@vercel/postgres';

type Primitive = string | number | boolean | undefined | null;
let sql: (strings: TemplateStringsArray, ...values: Primitive[]) => Promise<pg.QueryResult<any>>;

if (process.env.GADGET_SELFHOST === 'true') {
  // Code for self-hosted PostgreSQL database. Environmental 
  // variables can be set in .env.local:

  const { Pool } = pg; 

  const pool: pg.Pool = new Pool();

  // Function based off Apache 2.0 licensed code: 
  // https://github.com/vercel/storage/blob/main/packages/postgres/src/sql-template.ts
  function isTemplateStringsArray(
    strings: unknown,
  ): strings is TemplateStringsArray {
    return (
      Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
    );
  }


  function sqlSelfHost(
    strings: TemplateStringsArray,
    ...values: Primitive[]
  ): Promise<pg.QueryResult<any>> {
    if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
      throw new Error(
        "`sql` must be used as a tagged template."
      );
    }

    let result = strings[0] ?? '';

    for (let i = 1; i < strings.length; i++) {
      result += `$${i}${strings[i] ?? ''}`;
    }

    return pool.query(result, values);
  }

  sql = sqlSelfHost;

} 
else sql = sqlVercel;

export { sql };