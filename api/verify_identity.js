const IDENTITIES = {
  "10000001": { postcode: "94107", customer_name: "Jordan Rivera" },
  "10000002": { postcode: "10001", customer_name: "Sam Patel" }
};

const norm = (v) => String(v ?? "").replace(/\s+/g, "");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { account_number, postcode } = req.body || {};
  const acct = norm(account_number);
  const record = IDENTITIES[acct];
  // 200 + success:false (not 4xx) so the workflow can branch on the semantic result.
  if (!record || record.postcode !== norm(postcode)) {
    return res.status(200).json({ success: false });
  }
  return res.status(200).json({
    success: true,
    customer_name: record.customer_name,
    account_number: acct
  });
}
