// src/pages/_document.tsx
import { createRelayDocument, RelayDocument } from 'relay-nextjs/document';
import NextDocument, {
  Html,
  Head,
  DocumentContext,
  Main,
  NextScript,
} from 'next/document';
import Link from 'next/link'

class ExampleDocument extends NextDocument {
  static async getInitialProps(ctx) {
    const relayDocument = createRelayDocument();

    const renderPage = ctx.renderPage;
    ctx.renderPage = () =>
      renderPage({
        enhanceApp: (App) => relayDocument.enhance(App),
      });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      relayDocument,
    };
  }

  render() {
    const { relayDocument } = this.props;

    return (
      <Html>
        <Head>
          <relayDocument.Script />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default ExampleDocument;