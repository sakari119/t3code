export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface TtsOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export function speak(text: string, options?: TtsOptions): void {
  if (!isTtsSupported() || !text.trim()) return;
  const utterance = new SpeechSynthesisUtterance(text.trim());
  if (options?.rate !== undefined) utterance.rate = options.rate;
  if (options?.pitch !== undefined) utterance.pitch = options.pitch;
  if (options?.volume !== undefined) utterance.volume = options.volume;
  if (options?.voice !== undefined && options.voice !== null) {
    utterance.voice = options.voice;
  }
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  if (isTtsSupported()) {
    window.speechSynthesis.cancel();
  }
}

/** Extract the text content from a `/say <text>` directive at the beginning of a string. */
export function parseSayDirective(text: string): string | null {
  const match = /^\/say\s+(.+)$/im.exec(text.trim());
  return match?.[1]?.trim() ?? null;
}

/**
 * Scan text for any `/say <message>` directives and speak the first one found.
 * Returns true if a directive was found and speech was triggered.
 */
export function speakFromSayDirective(text: string, options?: TtsOptions): boolean {
  const content = parseSayDirective(text);
  if (content === null) return false;
  speak(content, options);
  return true;
}
