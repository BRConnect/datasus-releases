/**
 * Cartão social gerado no servidor: sem serviço externo, pronto para Open Graph e mensageiros.
 */
import { ImageResponse } from "next/og";

export const alt = "DATASUS Releases — versões oficiais, organizadas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          background: "#f7f3eb",
          color: "#1c2724",
          padding: "68px 76px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", position: "absolute", right: "-60px", top: "-50px", height: "780px", width: "520px", transform: "rotate(8deg)", background: "#ebe5d8", borderLeft: "2px solid rgba(7,91,75,.17)" }} />
        <div style={{ display: "flex", position: "absolute", right: "105px", top: "115px", height: "252px", width: "330px", background: "#fffdf8", border: "2px solid rgba(7,91,75,.17)", boxShadow: "22px 24px 0 rgba(7,91,75,.1)" }} />
        <div style={{ display: "flex", position: "absolute", right: "32px", top: "71px", height: "110px", width: "270px", background: "rgba(255,253,248,.75)", border: "2px solid rgba(169,68,34,.25)" }} />
        <div style={{ display: "flex", position: "relative", zIndex: 1, flexDirection: "column", maxWidth: "770px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#075b4b", fontFamily: "Arial, sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase" }}>
            <div style={{ display: "flex", height: "22px", width: "22px", background: "#a94422" }} />
            Arquivo de versões oficiais
          </div>
          <div style={{ display: "flex", marginTop: "54px", flexDirection: "column", fontSize: "79px", fontWeight: 400, letterSpacing: "-4px", lineHeight: 0.93 }}>
            <span>A versão certa.</span>
            <span style={{ color: "#075b4b" }}>No lugar certo.</span>
          </div>
          <div style={{ display: "flex", marginTop: "36px", maxWidth: "650px", color: "#53615a", fontFamily: "Arial, sans-serif", fontSize: "28px", lineHeight: 1.38 }}>
            Versões DATASUS organizadas, rastreáveis e disponíveis por HTTPS.
          </div>
          <div style={{ display: "flex", marginTop: "46px", color: "#075b4b", fontFamily: "Arial, sans-serif", fontSize: "19px", fontWeight: 700, letterSpacing: "2px" }}>
            SISAIH01&nbsp;&nbsp;•&nbsp;&nbsp;BPA&nbsp;&nbsp;•&nbsp;&nbsp;SIA
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
