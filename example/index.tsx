import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import WebReader from '../src';
import pdfManifestUrl from 'url:./samples/pdfManifest.json';
import webpubManifestUrl from 'url:./samples/webpubManifest.json';
import epubUrl from 'url:./samples/moby.epub';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/pdf">
          <WebReader
            entrypoint={pdfManifestUrl}
            format="application/pdf+json"
          />
        </Route>
        <Route path="/webpub">
          <WebReader
            entrypoint={webpubManifestUrl}
            format="application/webpub"
          />
        </Route>
        <Route path="/epub">
          <WebReader entrypoint={epubUrl} format="application/epub" />
        </Route>
        <Route path="/">
          <h1>Web Reader Proof of Concept</h1>
          <ul>
            <li>
              <Link to="/epub">Epub Example</Link>
            </li>
            <li>
              <Link to="/pdf">Pdf Example</Link>
            </li>
            <li>
              <Link to="/webpub">Webpub Example</Link>
            </li>
          </ul>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
