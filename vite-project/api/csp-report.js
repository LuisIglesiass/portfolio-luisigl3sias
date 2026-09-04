// Vercel serverless function — receives CSP / Reporting API violation
// reports (POST, application/reports+json or application/csp-report)
// and logs them to the function's Vercel logs. No storage, no
// forwarding — just makes violations actually visible instead of
// advertising a Reporting-Endpoints header that goes nowhere.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  try {
    req.setEncoding("utf8");
    let body = "";
    for await (const chunk of req) body += chunk;
    console.warn("[csp-report]", body);
  } catch (err) {
    console.error("[csp-report] failed to read body", err);
  }

  res.status(204).end();
}
