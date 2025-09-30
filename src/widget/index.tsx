import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/style.css';
import { BoardContainer } from './components/board/BoardContainer';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    const script = document.currentScript as HTMLScriptElement;
    const mode = getMode(script);
    const clientKey = getClientKey(script);
    const className = getClassName(script);
    const target = getEmbedTarget(script);

    const hostEl = document.createElement('div');
    const shadow = hostEl.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    shadowRoot.id = 'widget-root';

    let component: JSX.Element;
    if (mode === 'board') {
      component = <BoardContainer authToken={clientKey} className={className} />;
    } else {
      component = <WidgetContainer clientKey={clientKey} className={className} />;
    }

    // Inject styles directly into the ShadowRoot for proper scoping
    injectStyle(shadow);
    shadow.appendChild(shadowRoot);
    const root = createRoot(shadowRoot);
    root.render(component);

    if (target) {
      target.appendChild(hostEl);
    } else {
      document.body.appendChild(hostEl);
    }
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: ShadowRoot) {
  const fileName = process.env.WIDGET_NAME || 'widget';
  const href = process.env.WIDGET_CSS_URL || `/${fileName}.css`;

  // Primary: link tag (supported in modern Chromium, but not universally guaranteed in shadow DOM)
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  shadowRoot.appendChild(link);

  // Fallback: style tag with @import ensures broad support inside shadow roots
  const style = document.createElement('style');
  style.textContent = `@import url("${href}");`;
  shadowRoot.appendChild(style);

  // Last-resort fallback: inline CSS text to guarantee styles in Shadow DOM
  try {
    fetch(href, { credentials: 'omit' })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`css ${r.status}`))))
      .then((css) => {
        const inline = document.createElement('style');
        inline.textContent = css;
        shadowRoot.appendChild(inline);
      })
      .catch(() => {
        // ignore; link/@import may have already worked
      });
  } catch {
    // ignore
  }
}

function getClientKey(script: HTMLScriptElement | null) {
  const clientKey = script?.getAttribute('data-client-key');

  if (!clientKey) {
    throw new Error('Missing data-client-key attribute');
  }

  return clientKey;
}

function getClassName(script: HTMLScriptElement | null) {
  let className = script?.getAttribute('data-class-name');
  if (!className) {
    className = '';
  }
  return className;
}

function getMode(script: HTMLScriptElement | null) {
  const mode = (script?.getAttribute('data-mode') || 'widget').toLowerCase();
  return mode === 'board' ? 'board' : 'widget';
}

function getEmbedTarget(script: HTMLScriptElement | null): HTMLElement | null {
  const sel = script?.getAttribute('data-embed-target');
  if (!sel) return null;
  try {
    const el = document.querySelector(sel);
    if (el instanceof HTMLElement) return el;
    return null;
  } catch {
    return null;
  }
}

initializeWidget();
