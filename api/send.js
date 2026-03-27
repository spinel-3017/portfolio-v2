export default async function handler(req, res) {
  console.log('Function called');
  return res.status(200).json({ success: true });
}