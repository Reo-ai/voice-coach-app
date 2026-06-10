// ライブラリ追加を避けるための極めて軽量なMarkdownレンダラー
// 太字 / 見出し / 箇条書き / 改行 / コードのみ対応

function escape(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderMarkdown(src: string): string {
  const esc = escape(src);
  const lines = esc.split("\n");
  const html: string[] = [];
  let inList = false;
  let inOl = false;

  const closeLists = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // 見出し
    const h = line.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      closeLists();
      const level = h[1].length + 1; // h2〜h4
      html.push(`<h${level}>${inlineFmt(h[2])}</h${level}>`);
      continue;
    }

    // 箇条書き
    const ul = line.match(/^[-・]\s+(.+)$/);
    if (ul) {
      if (!inList) {
        closeLists();
        html.push('<ul class="list-disc pl-5 my-1 space-y-0.5">');
        inList = true;
      }
      html.push(`<li>${inlineFmt(ul[1])}</li>`);
      continue;
    }

    // 番号付きリスト
    const ol = line.match(/^(\d+)\.\s+(.+)$/);
    if (ol) {
      if (!inOl) {
        closeLists();
        html.push('<ol class="list-decimal pl-5 my-1 space-y-0.5">');
        inOl = true;
      }
      html.push(`<li>${inlineFmt(ol[2])}</li>`);
      continue;
    }

    // 空行
    if (line === "") {
      closeLists();
      html.push("<br/>");
      continue;
    }

    closeLists();
    html.push(`<p>${inlineFmt(line)}</p>`);
  }
  closeLists();
  return html.join("");
}

function inlineFmt(s: string): string {
  // **bold**
  let out = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // `code`
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-[0.85em]">$1</code>',
  );
  return out;
}
