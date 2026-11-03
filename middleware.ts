import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function middleware(request:NextRequest){
 let response=NextResponse.next({request});
 const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
  cookies:{getAll:()=>request.cookies.getAll(),setAll(cookies){cookies.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}
 });
 const {data:{user}}=await supabase.auth.getUser();
 if(!user && request.nextUrl.pathname.startsWith("/studio")){const url=request.nextUrl.clone();url.pathname="/login";return NextResponse.redirect(url);}
 if(user && ["/login","/signup"].includes(request.nextUrl.pathname)){const url=request.nextUrl.clone();url.pathname="/studio";return NextResponse.redirect(url);}
 return response;
}
export const config={matcher:["/studio/:path*","/login","/signup"]};
