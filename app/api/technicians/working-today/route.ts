export const dynamic = "force-dynamic";

const technicianApiBase =
  process.env.TECHNICIAN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_TECHNICIAN_API_BASE_URL ||
  "http://127.0.0.1:5000";

export async function GET() {
  try {
    const upstream = await fetch(`${technicianApiBase.replace(/\/$/, "")}/api/technicians/working-today`, {
      cache: "no-store",
    });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "cache-control": "no-store",
        "content-type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to load technicians", error);
    return Response.json({ error: "Failed to load technicians" }, { status: 502 });
  }
}
