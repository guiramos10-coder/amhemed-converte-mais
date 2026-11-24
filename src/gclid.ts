// Código do clique do Google Ads (gclid). O anúncio traz o código no endereço da página; ele fica guardado
// por 90 dias e vai junto com o formulário, para o CRM saber de qual clique veio cada lead.
const CHAVE = "nv_gclid";
const VALIDADE_MS = 90 * 24 * 60 * 60 * 1000;

export function guardarGclid(): void {
  try {
    const gclid = new URLSearchParams(window.location.search).get("gclid");
    if (gclid && /^[\w-]{10,200}$/.test(gclid)) {
      localStorage.setItem(CHAVE, JSON.stringify({ gclid, em: Date.now() }));
    }
  } catch {
    // navegador sem localStorage: o formulário segue sem o código
  }
}

export function lerGclid(): string {
  guardarGclid();
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && typeof salvo.gclid === "string" && Date.now() - Number(salvo.em) < VALIDADE_MS) return salvo.gclid;
  } catch {
    // valor guardado inválido: ignora
  }
  return "";
}
