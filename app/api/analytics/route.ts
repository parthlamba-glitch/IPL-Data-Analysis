import { NextRequest, NextResponse } from "next/server";
import { analyze, options } from "@/lib/analytics";
export const runtime = "nodejs";
export function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams;
    const season = p.get("season");
    return NextResponse.json(
      {
        options,
        data: analyze({
          season: season ? Number(season) : undefined,
          team: p.get("team") || undefined,
          player: p.get("player") || undefined,
          venue: p.get("venue") || undefined,
          result: p.get("result") || undefined,
          from: p.get("from") || undefined,
          to: p.get("to") || undefined,
        }),
      },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 500 },
    );
  }
}
