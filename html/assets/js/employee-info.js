/**
 * <employee-info> — interactive bio card web component.
 *
 * Authoring — named-slot mode:
 *   <employee-info>
 *     <img  slot="portrait"   src="…" alt="…">
 *     <span slot="first-name">Ada</span>
 *     <span slot="last-name">Marcellus</span>
 *     <span slot="title">CEO</span>
 *     <!-- optional -->
 *     <p    slot="bio">…</p>
 *     <ul   slot="experience"><li>…</li></ul>
 *     <ul   slot="education"><li>…</li></ul>
 *     <ul   slot="skills"><li>…</li></ul>
 *     <ul   slot="links"><li><a href="…">…</a></li></ul>
 *     <p    slot="quote">…</p>
 *   </employee-info>
 *
 * Authoring — JSON mode (named slots take precedence if both present):
 *   <employee-info>
 *     <script slot="data" type="application/json">
 *       { "firstName":"Rune", "lastName":"Vasquez", "title":"CTO",
 *         "portrait":"assets/img/avatar.svg",
 *         "bio":"…", "experience":["…"], "education":["…"],
 *         "skills":["…"], "links":[{"label":"GitHub","href":"…"}],
 *         "quote":"…" }
 *     </script>
 *   </employee-info>
 *
 * CSS custom properties exposed on the host:
 *   --employee-card-bg      (default: transparent)
 *   --employee-accent       (default: #00e5ff)
 *   --employee-radius       (default: 14px)
 */

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = /* html */`
<style>
  :host {
    display: block;
    --_bg:     var(--employee-card-bg, rgb(255 255 255 / 0.03));
    --_accent: var(--employee-accent,  #00e5ff);
    --_radius: var(--employee-radius,  14px);
  }

  /* ── Compact card (always visible) ──────────────── */
  .card-btn {
    width: 100%;
    background: var(--_bg);
    border: 1px solid rgb(255 255 255 / 0.08);
    border-radius: var(--_radius);
    cursor: pointer;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    transition:
      border-color 250ms cubic-bezier(0.22,1,0.36,1),
      box-shadow   250ms cubic-bezier(0.22,1,0.36,1),
      transform    250ms cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
    color: inherit;
    font-family: inherit;
  }

  .card-btn:hover {
    border-color: rgb(0 229 255 / 0.35);
    box-shadow: 0 0 28px rgb(0 229 255 / 0.18);
    transform: translateY(-3px);
  }

  .card-btn:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: 2px;
  }

  :host([open]) .card-btn {
    transform: none;
    border-color: rgb(0 229 255 / 0.4);
    box-shadow: 0 0 40px rgb(0 229 255 / 0.2);
    border-radius: var(--_radius) var(--_radius) 0 0;
    border-bottom-color: transparent;
  }

  /* portrait wrapper */
  .portrait-wrap {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgb(0 229 255 / 0.3);
    box-shadow: 0 0 16px rgb(0 229 255 / 0.2);
    flex-shrink: 0;
    background: rgb(0 0 0 / 0.3);
  }

  ::slotted([slot="portrait"]) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .portrait-wrap svg {
    width: 100%;
    height: 100%;
  }

  .card-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: #e6ecff;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .card-title {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 0.7rem;
    color: var(--_accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0;
  }

  .chevron {
    width: 18px;
    height: 18px;
    color: rgb(255 255 255 / 0.3);
    transition: transform 300ms cubic-bezier(0.22,1,0.36,1),
                color     250ms;
    flex-shrink: 0;
  }

  :host([open]) .chevron {
    transform: rotate(180deg);
    color: var(--_accent);
  }

  /* ── Expanded detail panel ───────────────────────── */
  .details-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 400ms cubic-bezier(0.22,1,0.36,1);
    border: 1px solid rgb(0 229 255 / 0.4);
    border-top: none;
    border-radius: 0 0 var(--_radius) var(--_radius);
    background: rgb(255 255 255 / 0.03);
    overflow: hidden;
  }

  :host([open]) .details-wrap {
    grid-template-rows: 1fr;
  }

  .details-inner {
    overflow: hidden;
    min-height: 0;
  }

  .details-content {
    padding: 2rem;
  }

  /* ── Expanded header row ─────────────────────────── */
  .expanded-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgb(255 255 255 / 0.08);
    margin-bottom: 1.5rem;
  }

  .expanded-portrait {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgb(0 229 255 / 0.4);
    box-shadow: 0 0 20px rgb(0 229 255 / 0.2);
    flex-shrink: 0;
    background: rgb(0 0 0 / 0.3);
  }

  .expanded-header-text h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #e6ecff;
    letter-spacing: -0.02em;
    margin: 0 0 0.25rem;
    line-height: 1.2;
  }

  .expanded-header-text p {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 0.72rem;
    color: var(--_accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
    max-width: none;
  }

  /* ── Two-column body ─────────────────────────────── */
  .details-body {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 720px) {
    .details-body {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ── Subsections ─────────────────────────────────── */
  .subsection {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .subsection[hidden] { display: none; }

  .subsection-label {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 0.68rem;
    color: rgb(255 255 255 / 0.35);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: block;
  }

  .subsection ::slotted(p),
  .subsection .json-p {
    font-size: 0.9rem;
    color: #9aa6c7;
    line-height: 1.75;
    max-width: none;
    margin: 0;
  }

  .subsection ::slotted(ul),
  .subsection .json-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .subsection ::slotted(ul) li,
  .subsection .json-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #9aa6c7;
    line-height: 1.6;
  }

  .subsection ::slotted(ul) li::before,
  .subsection .json-list li.bullet::before {
    content: "▸";
    color: var(--_accent);
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* skills chips */
  .skills-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .skill-chip {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 0.7rem;
    color: var(--_accent);
    background: rgb(0 229 255 / 0.07);
    border: 1px solid rgb(0 229 255 / 0.2);
    border-radius: 999px;
    padding: 3px 10px;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  /* links */
  .links-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .links-list a,
  .subsection ::slotted([slot="links"]) a {
    font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 0.75rem;
    color: var(--_accent);
    background: rgb(0 229 255 / 0.07);
    border: 1px solid rgb(0 229 255 / 0.2);
    border-radius: 999px;
    padding: 4px 12px;
    text-decoration: none;
    transition: background 150ms, box-shadow 150ms;
    display: inline-block;
  }

  .links-list a:hover {
    background: rgb(0 229 255 / 0.14);
    box-shadow: 0 0 12px rgb(0 229 255 / 0.25);
  }

  /* quote */
  .quote-text {
    font-style: italic;
    color: #9aa6c7;
    font-size: 0.9rem;
    line-height: 1.75;
    border-left: 2px solid var(--_accent);
    padding-left: 1rem;
    margin: 0;
  }
</style>

<button class="card-btn" aria-expanded="false">
  <div class="portrait-wrap">
    <slot name="portrait"></slot>
  </div>
  <p class="card-name"><slot name="first-name"></slot>&nbsp;<slot name="last-name"></slot></p>
  <p class="card-title"><slot name="title"></slot></p>
  <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
</button>

<div class="details-wrap" role="region" aria-label="Employee details">
  <div class="details-inner">
    <div class="details-content">
      <div class="expanded-header">
        <div class="expanded-portrait" id="exp-portrait"></div>
        <div class="expanded-header-text">
          <h2 id="exp-name"></h2>
          <p id="exp-title"></p>
        </div>
      </div>
      <div class="details-body">
        <div class="details-left">
          <div class="subsection" id="sec-bio" hidden>
            <span class="subsection-label">About</span>
            <slot name="bio"></slot>
          </div>
          <div class="subsection" id="sec-quote" hidden style="margin-top:1.5rem">
            <span class="subsection-label">In Their Words</span>
            <slot name="quote"></slot>
          </div>
        </div>
        <div class="details-right">
          <div class="subsection" id="sec-experience" hidden>
            <span class="subsection-label">Experience</span>
            <slot name="experience"></slot>
          </div>
          <div class="subsection" id="sec-education" hidden style="margin-top:1.5rem">
            <span class="subsection-label">Education</span>
            <slot name="education"></slot>
          </div>
          <div class="subsection" id="sec-skills" hidden style="margin-top:1.5rem">
            <span class="subsection-label">Skills</span>
            <slot name="skills"></slot>
          </div>
          <div class="subsection" id="sec-links" hidden style="margin-top:1.5rem">
            <span class="subsection-label">Links</span>
            <slot name="links"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- hidden slot to capture JSON data element -->
<slot name="data" style="display:none"></slot>
`;

class EmployeeInfo extends HTMLElement {
  static get observedAttributes() { return ['open']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._btn = this.shadowRoot.querySelector('.card-btn');
    this._detailsWrap = this.shadowRoot.querySelector('.details-wrap');
  }

  connectedCallback() {
    this._btn.addEventListener('click', () => this._toggle());

    // Populate from JSON slot if present, then show/hide subsections
    this._applyJsonData();

    // Show/hide subsections based on slot content
    this._bindSlotVisibility('bio',        'sec-bio');
    this._bindSlotVisibility('quote',      'sec-quote');
    this._bindSlotVisibility('experience', 'sec-experience');
    this._bindSlotVisibility('education',  'sec-education');
    this._bindSlotVisibility('skills',     'sec-skills');
    this._bindSlotVisibility('links',      'sec-links');

    // Build the expanded header mirror of portrait / name / title
    this._populateExpandedHeader();

    // React to future slot changes (e.g. dynamic DOM edits)
    this.shadowRoot.querySelectorAll('slot').forEach(slot => {
      slot.addEventListener('slotchange', () => {
        this._populateExpandedHeader();
      });
    });
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'open') {
      const isOpen = val !== null;
      this._btn.setAttribute('aria-expanded', String(isOpen));
      // keep detail region hidden for AT when closed
      this._detailsWrap.setAttribute('aria-hidden', String(!isOpen));
    }
  }

  _toggle() {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('employee-toggle', {
        detail: { open: false }, bubbles: true, composed: true
      }));
    } else {
      this.setAttribute('open', '');
      this.dispatchEvent(new CustomEvent('employee-toggle', {
        detail: { open: true }, bubbles: true, composed: true
      }));
    }
  }

  _bindSlotVisibility(slotName, sectionId) {
    const slot = this.shadowRoot.querySelector(`slot[name="${slotName}"]`);
    const sec  = this.shadowRoot.getElementById(sectionId);
    if (!slot || !sec) return;

    const update = () => {
      const assigned = slot.assignedNodes({ flatten: true });
      const hasContent = assigned.some(n => {
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        return false;
      });
      sec.hidden = !hasContent;
    };

    slot.addEventListener('slotchange', update);
    update();
  }

  _populateExpandedHeader() {
    const expPortrait = this.shadowRoot.getElementById('exp-portrait');
    const expName     = this.shadowRoot.getElementById('exp-name');
    const expTitle    = this.shadowRoot.getElementById('exp-title');

    // Name
    const fn = this.querySelector('[slot="first-name"]');
    const ln = this.querySelector('[slot="last-name"]');
    if (fn || ln) {
      expName.textContent = [fn?.textContent, ln?.textContent].filter(Boolean).join(' ');
    }

    // Title
    const titleEl = this.querySelector('[slot="title"]');
    if (titleEl) expTitle.textContent = titleEl.textContent;

    // Portrait clone
    const portraitEl = this.querySelector('[slot="portrait"]');
    if (portraitEl && expPortrait) {
      expPortrait.innerHTML = '';
      const clone = portraitEl.cloneNode(true);
      clone.removeAttribute('slot');
      clone.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
      expPortrait.appendChild(clone);
    }
  }

  _applyJsonData() {
    const dataSlot = this.shadowRoot.querySelector('slot[name="data"]');
    if (!dataSlot) return;

    const nodes = dataSlot.assignedElements();
    const scriptEl = nodes.find(n => n.tagName === 'SCRIPT');
    if (!scriptEl) return;

    let data;
    try { data = JSON.parse(scriptEl.textContent); } catch { return; }

    // Named slots take precedence — only inject fields that aren't already slotted
    const inject = (slotName, html) => {
      if (!this.querySelector(`[slot="${slotName}"]`)) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('slot', slotName);
        wrapper.innerHTML = html;
        this.appendChild(wrapper);
      }
    };

    const injectText = (slotName, text) => {
      if (!this.querySelector(`[slot="${slotName}"]`)) {
        const span = document.createElement('span');
        span.setAttribute('slot', slotName);
        span.textContent = text;
        this.appendChild(span);
      }
    };

    if (data.firstName)  injectText('first-name', data.firstName);
    if (data.lastName)   injectText('last-name',  data.lastName);
    if (data.title)      injectText('title',       data.title);

    if (data.portrait) {
      if (!this.querySelector('[slot="portrait"]')) {
        const img = document.createElement('img');
        img.setAttribute('slot', 'portrait');
        img.src = data.portrait;
        img.alt = [data.firstName, data.lastName].filter(Boolean).join(' ');
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        this.appendChild(img);
      }
    }

    if (data.bio)  inject('bio',  `<p>${data.bio}</p>`);
    if (data.quote) inject('quote', `<p class="quote-text">"${data.quote}"</p>`);

    if (Array.isArray(data.experience) && data.experience.length) {
      inject('experience', `<ul>${data.experience.map(e => `<li class="bullet">${e}</li>`).join('')}</ul>`);
    }

    if (Array.isArray(data.education) && data.education.length) {
      inject('education', `<ul>${data.education.map(e => `<li class="bullet">${e}</li>`).join('')}</ul>`);
    }

    if (Array.isArray(data.skills) && data.skills.length) {
      inject('skills', `<div class="skills-chips">${data.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}</div>`);
    }

    if (Array.isArray(data.links) && data.links.length) {
      inject('links', `<div class="links-list">${data.links.map(l => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join('')}</div>`);
    }
  }
}

customElements.define('employee-info', EmployeeInfo);
