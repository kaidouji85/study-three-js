import Stats from 'stats.js';

/**
 * パフォーマンス情報を表示する
 *
 * @param dom パフォーマンス情報をアペンドするHTML要素
 */
export function viewPerformanceStats(dom: HTMLElement): void {
  const stats = new Stats();
  stats.dom.style.position = "absolute";
  stats.dom.style.top = "env(safe-area-inset-top)";
  stats.dom.style.left = "env(safe-area-inset-left)";
  dom.appendChild(stats.dom);

  const update = time => {
    requestAnimationFrame(update);
    stats.update();
  };
  requestAnimationFrame(update);
}