import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, _event: NextFetchEvent) {
  
  return NextResponse.next();
}
