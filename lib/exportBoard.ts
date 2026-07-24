import html2canvas from "html2canvas";

export async function exportBoardAsPng(
  element: HTMLElement,
  filename = "jcc-vc-bingo.png",
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
