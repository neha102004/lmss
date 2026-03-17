/* Minimal YT global for react-youtube (full types from @types/youtube) */
declare namespace YT {
  interface Player {
    getCurrentTime(): number;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
  }
}
