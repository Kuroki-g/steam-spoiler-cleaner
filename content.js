// 対象のクラス名を指定
const classNameToUnwrap = 'bb_spoiler';

/**
 * 指定されたクラス名を持つ全てのspan要素を取得し、そのspan要素を取り除いて親のタグに入れ込む。
 */
function unwrapSpansByClass() {
  const spansToUnwrap = document.querySelectorAll(`span.${classNameToUnwrap}`);

  spansToUnwrap.forEach(span => {
    const parent = span.parentNode; // spanの親要素を取得
    const textContent = span.textContent; // spanが持つテキスト内容を取得

    // 親要素が存在し、かつ、spanがテキスト内容を持っている場合
    if (parent && textContent) {
      // 安全のためにテキストノードとして作成
      // これにより、もしテキスト内にHTMLタグのようなものが含まれていても、
      // それがタグとして解釈されることを防ぎます（XSS対策）。
      const textNode = document.createTextNode(textContent);

      // span要素の「直前」に、取得したテキストノードを挿入
      parent.insertBefore(textNode, span);

      // 元のspan要素を削除
      span.remove();

      // console.log('Unwrapped span:', textContent); // デバッグ用: 処理したテキストをコンソールに出力
    } else if (parent) {
        // テキストコンテンツを持たないspanの場合は、単に削除する (必要に応じて)
        span.remove();
        // console.log('Removed empty span with class:', classNameToUnwrap); // デバッグ用
    }
  });
}

// --- ページ読み込み時 & 動的コンテンツ対応 ---

// ページ読み込みが完了したタイミングで関数を実行
unwrapSpansByClass();

// 動的に要素が追加される場合に対応する場合（オプション）
// MutationObserverを使ってDOMの変更を監視し、新しい要素が追加されたら再度処理を実行する
const observer = new MutationObserver((mutationsList, observer) => {
  // DOMに変更があった場合に再度処理を実行
  // setTimeoutを入れることで、短時間に大量の変更が発生した場合の負荷を少し軽減できる場合がある
  setTimeout(unwrapSpansByClass, 50);
});

// 監視を開始（body要素とその子孫要素の変更を監視）
observer.observe(document.body, { childList: true, subtree: true });
