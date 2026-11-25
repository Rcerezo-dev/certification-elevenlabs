export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { account_number, order_id, new_address } = req.body || {};
  if (!account_number || !order_id || !new_address) {
    return res.status(400).json({ error: "account_number, order_id, new_address required" });
  }
  // Stateless: always succeeds and echoes the new address so tests can run repeatedly.
  return res.status(200).json({
    success: true,
    order_id: String(order_id),
    new_address,
    updated_at: new Date().toISOString()
  });
}
