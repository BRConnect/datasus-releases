/** Ícone Apple touch gerado localmente para atalhos em iOS e iPadOS. */
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", background: "#075b4b", borderRadius: "36px" }}>
        <div style={{ display: "flex", position: "relative", height: "82px", width: "112px", alignItems: "center", justifyContent: "center", background: "#fffdf8" }}>
          <div style={{ display: "flex", position: "absolute", bottom: "22px", height: "11px", width: "65px", background: "#a94422" }} />
          <div style={{ display: "flex", position: "absolute", top: "-23px", height: "28px", width: "38px", background: "#4dc1a4" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
