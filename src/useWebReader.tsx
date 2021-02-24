import React from 'react';
import EpubClient from './epub/EpubClient';
import EpubRenderer from './epub/EpubRenderer';
import PdfClient from './pdf/PdfClient';
import PdfRenderer from './pdf/PdfRenderer';
import {
  AnyFormat,
  PdfMimeType,
  EpubMimeType,
  PdfLocation,
  TocItem,
} from './types';

export type UseWebReaderReturn = {
  title: string | null;
  isLoading: boolean;
  // we return fully formed JSX elements so the consumer doesn't need to know
  // how to instantiate them or what to pass to them, that's the responsibility
  // of this hook. The consumer just places it within their UI.
  content: JSX.Element;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleTocChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toc: TocItem[] | undefined;
};

export default function useWebReader(
  format: AnyFormat,
  entrypoint: string
): UseWebReaderReturn {
  const [client, setClient] = React.useState<EpubClient | PdfClient | null>(
    null
  );
  const [location, setLocation] = React.useState<unknown>(undefined);

  // Computed values
  const isLoading = !client;
  const title = client?.title ?? null;
  const toc = client?.toc;

  /**
   * Initialize the client, which has to be asynchronously initialized
   * because it might need to fetch the manifest or otherwise.
   */
  React.useEffect(() => {
    switch (format) {
      case PdfMimeType:
        PdfClient.init(entrypoint, setLocation).then(setClient);
        break;
      case EpubMimeType:
        EpubClient.init(entrypoint, setLocation).then(setClient);
        break;
      default:
        throw new Error('Unimplemented format: ' + format);
    }
  }, [format, entrypoint]);

  // Handlers
  async function handleNextPage() {
    await client?.nextPage();
  }
  async function handlePrevPage() {
    await client?.prevPage();
  }
  async function handleTocChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (client && 'goTo' in client) client.goTo(e.target.value);
  }

  /**
   * We sadly have to do these checks because typescript can't narrow the type
   * of location and client properly based on the value of format passed in.
   */
  if (format === 'application/epub') {
    return {
      isLoading,
      toc,
      title,
      content: <EpubRenderer />,
      handleNextPage,
      handlePrevPage,
      handleTocChange,
    };
  }
  if (format === 'application/pdf+json') {
    return {
      isLoading,
      toc,
      title,
      content: (
        <PdfRenderer
          src={(client as PdfClient)?.contentFor(location as PdfLocation)}
        />
      ),
      handleNextPage,
      handlePrevPage,
      handleTocChange,
    };
  }
  throw new Error(
    `useWebReader failed to return. Format ${format} was not recognized.`
  );
}
