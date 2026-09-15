"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Camera, MapPin, QrCode, ThumbsDown, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { submitJanPramaanVerification } from "@/app/jan-pramaan/[id]/actions";

const GEOFENCE_METERS = 50;

// Haversine distance in meters — trd.md §2 "geolocation/geofencing" row:
// client-side gate only, server re-validates the coordinate on submission.
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

type Step = "geofence" | "qr" | "camera" | "vote" | "submitting" | "success" | "error";

export function JanPramaanCapture({
  projectId,
  siteLat,
  siteLng,
}: {
  projectId: string;
  siteLat: number | null;
  siteLng: number | null;
}) {
  const [step, setStep] = useState<Step>("geofence");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrConfirmed, setQrConfirmed] = useState(false);

  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasSite = siteLat != null && siteLng != null;
  const withinGeofence = hasSite && distance != null && distance <= GEOFENCE_METERS;

  function locate() {
    if (!hasSite) return;
    setLocating(true);
    setGeoError(null);
    if (!("geolocation" in navigator)) {
      setGeoError("This browser doesn't support location. Try a different device.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setDistance(distanceMeters(latitude, longitude, siteLat as number, siteLng as number));
        setLocating(false);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Enable it in your browser settings to verify."
            : "Couldn't get your location. Try again."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUri(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!coords || !vote || !photoDataUri) return;
    setStep("submitting");
    setErrorMsg(null);
    const result = await submitJanPramaanVerification(projectId, {
      photoDataUri,
      vote,
      note,
      deviceTimestamp: Date.now(),
      gpsLat: coords.lat,
      gpsLng: coords.lng,
      gpsDeviationM: distance ?? 0,
    });
    if (result.ok) {
      setStep("success");
    } else {
      setErrorMsg(result.error);
      setStep("error");
    }
  }

  return (
    <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
      <h3 className="font-display text-lg tracking-wide text-ink-950">VERIFY THIS PROJECT</h3>
      <p className="mt-1 text-sm text-ink-950/60">
        Confirm you&apos;re at the site, scan the QR, snap a photo, and give it a thumbs up or down.
      </p>

      {step === "geofence" && (
        <div className="mt-5">
          {!hasSite ? (
            <p className="rounded-md bg-ink-950/8 px-4 py-3 text-sm text-ink-950/70">
              This project has no site coordinates on record yet, so on-site verification isn&apos;t
              available here.
            </p>
          ) : (
            <>
              <Button
                variant="marigold"
                onClick={locate}
                disabled={locating}
                className="w-full"
              >
                <MapPin size={18} weight="bold" className="mr-2" />
                {locating ? "Checking your location…" : "Verify This Project"}
              </Button>
              {geoError && <p className="mt-2 text-sm text-flagged">{geoError}</p>}
              {distance != null && !withinGeofence && (
                <p className="mt-2 text-sm text-flagged">
                  You&apos;re about {Math.round(distance)}m from the site — you need to be within{" "}
                  {GEOFENCE_METERS}m to verify. Move closer and try again.
                </p>
              )}
              {withinGeofence && (
                <div className="mt-3">
                  <p className="mb-3 text-sm font-semibold text-healthy">
                    ✅ You&apos;re on-site ({Math.round(distance ?? 0)}m from the sanctioned location).
                  </p>
                  <Button variant="marigold" className="w-full" onClick={() => setStep("qr")}>
                    Continue
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {step === "qr" && (
        <QrStep
          scannerOpen={scannerOpen}
          setScannerOpen={setScannerOpen}
          onConfirmed={() => {
            setQrConfirmed(true);
            setStep("camera");
          }}
        />
      )}

      {step === "camera" && (
        <div className="mt-5">
          <p className="mb-3 text-sm text-ink-950/70">
            Take a live photo of the site — camera only, no gallery uploads (this is how we keep old
            or edited photos out of the record).
          </p>
          {photoDataUri ? (
            <div className="mb-3 overflow-hidden rounded-md border border-ink-950/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoDataUri} alt="Captured site photo" className="h-48 w-full object-cover" />
            </div>
          ) : null}
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-ink-950/20 px-5 py-4 text-sm font-semibold text-ink-950 hover:border-marigold-600">
            <Camera size={18} weight="bold" />
            {photoDataUri ? "Retake photo" : "Open camera"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
          <Button
            variant="marigold"
            className="mt-4 w-full"
            disabled={!photoDataUri}
            onClick={() => setStep("vote")}
          >
            Continue
          </Button>
        </div>
      )}

      {step === "vote" && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-ink-950">Does this match what was sanctioned?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setVote("up")}
              className={`flex flex-1 flex-col items-center gap-1 rounded-md border-2 px-4 py-4 transition-colors duration-150 ${
                vote === "up" ? "border-marigold-600 bg-marigold-100" : "border-ink-950/15"
              }`}
            >
              <ThumbsUp size={22} weight={vote === "up" ? "fill" : "regular"} className="text-marigold-600" />
              <span className="text-sm font-semibold text-ink-950">Yes, matches</span>
            </button>
            <button
              type="button"
              onClick={() => setVote("down")}
              className={`flex flex-1 flex-col items-center gap-1 rounded-md border-2 px-4 py-4 transition-colors duration-150 ${
                vote === "down" ? "border-ink-950 bg-ink-950/8" : "border-ink-950/15"
              }`}
            >
              <ThumbsDown size={22} weight={vote === "down" ? "fill" : "regular"} className="text-ink-950" />
              <span className="text-sm font-semibold text-ink-950">No, doesn&apos;t match</span>
            </button>
          </div>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-950/50">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="Anything worth flagging for the DM?"
            className="mt-1 w-full rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 focus:border-marigold-600 focus:outline-none"
          />
          <Button variant="marigold" className="mt-4 w-full" disabled={!vote} onClick={handleSubmit}>
            Submit Verification
          </Button>
        </div>
      )}

      {step === "submitting" && (
        <p className="mt-5 text-sm text-ink-950/60">Submitting…</p>
      )}

      {step === "success" && <SuccessCheck />}

      {step === "error" && (
        <div className="mt-5">
          <p className="text-sm text-flagged">{errorMsg ?? "Something went wrong. Please try again."}</p>
          <Button variant="outline-paper" className="mt-3 w-full" onClick={() => setStep("vote")}>
            Try again
          </Button>
        </div>
      )}

      {qrConfirmed && step !== "qr" && step !== "geofence" && (
        <p className="mt-3 text-xs text-ink-950/40">QR confirmed for this project.</p>
      )}
    </div>
  );
}

// design.md §6.1 — the one deliberately-more-expressive moment in the whole
// product: a single reassuring signal, under 400ms, on the citizen's
// high-stakes rare submission. CSS transition only, so the global
// prefers-reduced-motion override in globals.css collapses it automatically.
function SuccessCheck() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle
        size={56}
        weight="fill"
        className={`text-healthy transition-all duration-[350ms] ease-out ${
          shown ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <p className="font-display text-lg tracking-wide text-ink-950">VERIFICATION SUBMITTED</p>
      <p className="text-sm text-ink-950/60">
        Thanks — your submission has been added to this project&apos;s citizen consensus.
      </p>
    </div>
  );
}

function QrStep({
  scannerOpen,
  setScannerOpen,
  onConfirmed,
}: {
  scannerOpen: boolean;
  setScannerOpen: (v: boolean) => void;
  onConfirmed: () => void;
}) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerOpen || !scannerRef.current) return;
    let cancelled = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled || !scannerRef.current) return;
      const scanner = new Html5Qrcode(scannerRef.current.id);
      instanceRef.current = scanner;
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 200 },
          () => {
            scanner.stop().catch(() => {});
            onConfirmed();
          },
          undefined
        )
        .catch(() => {
          // Camera unavailable/denied — the "Simulate scan" affordance below
          // remains the reliable demo path.
        });
    });

    return () => {
      cancelled = true;
      instanceRef.current?.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerOpen]);

  return (
    <div className="mt-5">
      <p className="mb-3 text-sm text-ink-950/70">
        Scan the site&apos;s Jan-Pramaan QR code to confirm you&apos;re verifying the right project.
      </p>

      {scannerOpen ? (
        <div id="jp-qr-reader" ref={scannerRef} className="overflow-hidden rounded-md" />
      ) : (
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-ink-950/20 px-5 py-4 text-sm font-semibold text-ink-950 hover:border-marigold-600"
        >
          <QrCode size={18} weight="bold" />
          Open camera scanner
        </button>
      )}

      <Button variant="marigold" className="mt-4 w-full" onClick={onConfirmed}>
        Simulate scan (demo)
      </Button>
      <p className="mt-2 text-center text-xs text-ink-950/40">
        No physical QR to scan yet? This project&apos;s ID is already known from the page you&apos;re on.
      </p>
    </div>
  );
}
