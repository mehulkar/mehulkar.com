class Rollover extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.innerHTML = `
            <style>
                div {
                    background: black;
                    font-size: 2rem;
                    padding: 1rem;
                }

                div span {
                    color: #fff;
                    cursor: pointer;
                    transition: color 1s ease;
                    transition-delay: 1s;
                }

                div .color:hover {
                    color: var(--color);
                    transition: none;
                }
            </style>

            <div><slot></slot></div>
        `;
  }

  connectedCallback() {
    const div = this.#shadowRoot.querySelector("div");

    const text = div
      .querySelector("slot")
      .assignedNodes()[0]
      .textContent.trim();

    const spans = text
      .split("")
      .map((char) => {
        if (!char.match(/\w/)) {
          return `<span>${char}</span>`;
        }

        // random color: https://stackoverflow.com/a/1152508
        const color =
          "#" +
          (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);

        return `<span class="color" style="--color:${color}">${char}</span>`;
      })
      .join("");

    div.innerHTML = spans;
  }
}

customElements.define("my-rollover", Rollover);
