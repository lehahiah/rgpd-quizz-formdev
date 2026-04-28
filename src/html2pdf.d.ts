declare module 'html2pdf.js' {
  interface Html2CanvasOptions {
    backgroundColor?: string;
    scale?: number;
    useCORS?: boolean;
  }

  interface JsPdfOptions {
    format?: string | number[];
    orientation?: 'portrait' | 'landscape';
    unit?: string;
  }

  interface PageBreakOptions {
    avoid?: string[];
    mode?: Array<'avoid-all' | 'css' | 'legacy'>;
  }

  interface Html2PdfOptions {
    filename?: string;
    image?: {
      quality?: number;
      type?: 'jpeg' | 'png' | 'webp';
    };
    html2canvas?: Html2CanvasOptions;
    jsPDF?: JsPdfOptions;
    margin?: number | number[];
    pagebreak?: PageBreakOptions;
  }

  interface Html2PdfWorker {
    from(source: HTMLElement | string): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    set(options: Html2PdfOptions): Html2PdfWorker;
  }

  interface Html2PdfStatic {
    (): Html2PdfWorker;
  }

  const html2pdf: Html2PdfStatic;
  export default html2pdf;
}
