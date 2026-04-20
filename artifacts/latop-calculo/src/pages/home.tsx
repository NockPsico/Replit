import { useState, useEffect, useCallback } from "react";

function decimalToHms(dec: number): string {
  const deg = Math.floor(dec);
  const minFull = (dec - deg) * 60;
  const min = Math.floor(minFull);
  const sec = (minFull - min) * 60;
  return `${deg}°${String(min).padStart(2, "0")}'${sec.toFixed(1)}″`;
}

const inputClass =
  "w-full px-5 py-5 text-lg rounded-xl border-none outline-none bg-[#10243f] text-white placeholder-[#556070] focus:ring-2 focus:ring-[#ffd60a]/50 transition";

export default function Home() {
  const [bandDeg, setBandDeg] = useState("");
  const [bandMin, setBandMin] = useState("");
  const [bandSec, setBandSec] = useState("");
  const [vao, setVao] = useState("");
  const [alt, setAlt] = useState("");
  const [flexa, setFlexa] = useState("");
  const [result, setResult] = useState<string>("···");
  const [resultDec, setResultDec] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const calcular = useCallback(() => {
    const bandDegN = parseFloat(bandDeg);
    const bandMinN = parseFloat(bandMin || "0");
    const bandSecN = parseFloat(bandSec || "0");
    const vaoN = parseFloat(vao);
    const altN = parseFloat(alt);
    const flexaN = parseFloat(flexa);

    const allEmpty = [bandDeg, vao, alt, flexa].every((v) => v === "");
    if (isNaN(bandDegN) || isNaN(vaoN) || isNaN(altN) || isNaN(flexaN)) {
      if (allEmpty) {
        setResult("···");
        setResultDec("");
        setStatus("idle");
      } else {
        setResult("ERRO");
        setResultDec("");
        setStatus("error");
      }
      return;
    }

    const bandDec = bandDegN + bandMinN / 60 + bandSecN / 3600;
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
  }, [bandDeg, bandMin, bandSec, vao, alt, flexa]);

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
          <div>
            <p className="text-[#556070] text-xs font-semibold tracking-widest uppercase mb-1 pl-1">
              BAND
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={bandDeg}
                  onChange={(e) => setBandDeg(e.target.value)}
                  placeholder="°"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffd60a] font-bold pointer-events-none">°</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={bandMin}
                  onChange={(e) => setBandMin(e.target.value)}
                  placeholder="'"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffd60a] font-bold pointer-events-none">'</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={bandSec}
                  onChange={(e) => setBandSec(e.target.value)}
                  placeholder="″"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffd60a] font-bold pointer-events-none">″</span>
              </div>
            </div>
          </div>

          <input
            type="number"
            inputMode="decimal"
            value={vao}
            onChange={(e) => setVao(e.target.value)}
            placeholder="VAO (m)"
            className={inputClass}
          />
          <input
            type="number"
            inputMode="decimal"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="ALT (m)"
            className={inputClass}
          />
          <input
            type="number"
            inputMode="decimal"
            value={flexa}
            onChange={(e) => setFlexa(e.target.value)}
            placeholder="FLEXA (m)"
            className={inputClass}
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
