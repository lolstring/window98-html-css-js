export interface ClippyAgent {
    hide(fast: boolean, callback?: () => void): void;
    show(): void;
    animations(): string[];
    stop(): void;
    play(animation: string, timeout?: number, callback?: () => void): void;
    speak(text: string): void;
    moveTo(x: number, y: number): void;
    gestureAt(x: number, y: number): void;
    stopCurrent(): void;
    animate(): void;
  }

export interface Clippy {
  load(agentName: string, callback: (agent: ClippyAgent) => void): void;
}