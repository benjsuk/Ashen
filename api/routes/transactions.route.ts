import { config } from "../config";
import { authUtil } from "../scripts/auth";
import {
  getTransactions,
  logTransaction,
  newTransaction,
} from "../scripts/transactions";

class Transactions {
  async GET(req: any) {
    const decoded = await authUtil.authenticate(req);
    if (!decoded) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const uid = decoded.uid;
    const dbResult = (await getTransactions()) || "NONE";
    return Response.json(JSON.parse(JSON.stringify(dbResult[0])), {
      headers: config.defaultHeaders,
    });
  }
  async POST(req: any) {
    const decoded = await authUtil.authenticate(req);
    if (!decoded) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const uid = decoded.uid;
    try {
      let request: any = await req.json();
      request = JSON.parse(JSON.stringify(request));
      if (
        !request.amount ||
        !request.description ||
        !request.date ||
        !((request.amount as number) > 0) ||
        !(
          !request.direction ||
          request.direction == "expense" ||
          request.direction == "income"
        )
      ) {
        return new Response("Transaction not in correct format.", {
          status: 400,
          headers: config.defaultHeaders,
        });
      }
      const inTransaction = newTransaction(
        request.amount,
        request.description,
        new Date(request.date),
        request.category || null,
        request.user || null,
        request.direction || null,
      );
      await logTransaction(inTransaction);
    } catch (e) {
      return new Response("Error: " + e, {
        status: 500,
        headers: config.defaultHeaders,
      });
    }
    return new Response("Completed", {
      status: 201,
      headers: config.defaultHeaders,
    });
  }
}

export const transactionsRouter = new Transactions();
