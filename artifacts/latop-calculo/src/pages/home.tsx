import { useState, useEffect, useCallback } from "react";

function hmsToDecimal(hms: number): number {
  const deg = Math.floor(hms);
  const rest = (hms - deg) * 100;
  const min = Math.floor(rest);
  const sec = (rest - min) * 100;
  return deg + min / 60 + sec / 3600;
}

function decimalToHms(dec: number): string {
  const deg = Math.floor(dec);
  const minFull = (dec - deg) * 60;
  const min = Math.floor(minFull);
  const sec = (minFull - min) * 60;
  return `${deg}°${String(min).padStart(2, "0")}'${sec.toFixed(1)}″`;
}

export default function Home() {
  const [band, setBand] = useState("");
  const [vao, setVao] = useState("");
  const [alt, setAlt] = useState("");
  const [flexa, setFlexa] = useState("");
  const [result, setResult] = useState<string>("···");
  const [resultDec, setResultDec] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const calcular = useCallback(() => {
    const bandRaw = parseFloat(band);
    const vaoN = parseFloat(vao);
    const altN = parseFloat(alt);
    const flexaN = parseFloat(flexa);

    if ([bandRaw, vaoN, altN, flexaN].some(isNaN)) {
      if ([band, vao, alt, flexa].some((v) => v !== "")) {
        setResult("ERRO");
        setResultDec("");
        setStatus("error");
      } else {
        setResult("···");
        setResultDec("");
        setStatus("idle");
      }
      return;
    }

    const bandDec = hmsToDecimal(bandRaw);
    // line 6 (missing from listing) pushed 90; line 9 "-" does 90 - BAND_dec
    // TAN(90 - BAND_dec) = COT(BAND_dec) = 1 / TAN(BAND_dec)
    const B = vaoN / Math.tan((bandDec * Math.PI) / 180) - altN;
    const num = 4 * Math.sqrt(Math.max(0, flexaN * altN)) + B - 4 * flexaN;
    const ang = 90 - (Math.atan(num / vaoN) * 180) / Math.PI;

    if (ang < 0 || ang > 90) {
      setResult("FORA PADRÃO");
      setResultDec("");
      setStatus("error");
      return;
    }

    setResult(decimalToHms(ang));
    setResultDec(ang.toFixed(6) + "°");
    setStatus("ok");

    if (navigator.vibrate) navigator.vibrate(30);
  }, [band, vao, alt, flexa]);

  useEffect(() => {
    calcular();
  }, [calcular]);

  return (
    <div className="min-h-screen bg-[#000814] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-[420px]">
        <h1 className="text-center text-[#ffd60a] text-2xl font-bold tracking-widest mb-8 uppercase">
          Latop Cálculo
        </h1>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            placeholder="BAND (ex: 1.30)"
            className="w-full px-5 py-5 text-lg rounded-xl border-none outline-none bg-[#10243f] text-white placeholder-[#556070] focus:ring-2 focus:ring-[#ffd60a]/50 transition"
          />
          <input
            type="number"
            inputMode="decimal"
            value={vao}
            onChange={(e) => setVao(e.target.value)}
            placeholder="VAO (m)"
            className="w-full px-5 py-5 text-lg rounded-xl border-none outline-none bg-[#10243f] text-white placeholder-[#556070] focus:ring-2 focus:ring-[#ffd60a]/50 transition"
          />
          <input
            type="number"
            inputMode="decimal"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="ALT (m)"
            className="w-full px-5 py-5 text-lg rounded-xl border-none outline-none bg-[#10243f] text-white placeholder-[#556070] focus:ring-2 focus:ring-[#ffd60a]/50 transition"
          />
          <input
            type="number"
            inputMode="decimal"
            value={flexa}
            onChange={(e) => setFlexa(e.target.value)}
            placeholder="FLEXA (m)"
            className="w-full px-5 py-5 text-lg rounded-xl border-none outline-none bg-[#10243f] text-white placeholder-[#556070] focus:ring-2 focus:ring-[#ffd60a]/50 transition"
          />

          <button
            onClick={calcular}
            className="w-full py-6 text-2xl font-bold bg-[#ffd60a] text-[#000814] rounded-2xl mt-1 active:scale-[0.98] transition-transform hover:brightness-105"
          >
            CALCULAR
          </button>
        </div>

        <div className="mt-10 text-center min-h-[100px] flex flex-col items-center justify-center">
          <p
            className={`font-bold tracking-wide transition-all duration-300 ${
              status === "ok"
                ? "text-[#00e676] text-6xl"
                : status === "error"
                ? "text-[#ff4d4d] text-4xl"
                : "text-[#556070] text-6xl"
            }`}
          >
            {result}
          </p>
          {resultDec && (
            <p className="mt-2 text-sm text-[#99aab5]">{resultDec}</p>
          )}
        </div>
      </div>
    </div>
  );
}
