// DIGITAL SPRINT landing — TypeScript базової компонентної структури

type ScrollTarget = string | HTMLElement | null;

interface ButtonOptions {
  target?: ScrollTarget;
}

class Button {
  private element: HTMLButtonElement;
  private target?: ScrollTarget;

  constructor(element: HTMLButtonElement, options: ButtonOptions = {}) {
    this.element = element;
    this.target = options.target;
    this.bind();
  }

  private resolveTarget(): HTMLElement | null {
    if (!this.target) return null;
    if (this.target instanceof HTMLElement) return this.target;
    if (typeof this.target === "string") {
      return document.querySelector<HTMLElement>(this.target);
    }
    return null;
  }

  private handleClick = (event: MouseEvent) => {
    const explicitTarget = this.resolveTarget();
    const dataTarget = this.element.getAttribute("data-scroll-to");
    const target =
      explicitTarget ??
      (dataTarget
        ? document.querySelector<HTMLElement>(dataTarget)
        : null);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  private bind() {
    this.element.addEventListener("click", this.handleClick);
  }
}

class Section {
  public readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }
}

class Container {
  public readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }
}

class FeatureList {
  public readonly element: HTMLElement;
  public readonly items: HTMLElement[];

  constructor(element: HTMLElement) {
    this.element = element;
    this.items = Array.from(
      element.querySelectorAll<HTMLElement>(".feature-card")
    );
  }
}

// Плавна анімація появи секцій
function setupSectionFadeIn() {
  const sections = document.querySelectorAll<HTMLElement>(".fade-in-section");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Підсвічування активного пункту меню при скролі
function setupActiveNavLinks() {
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("header nav a.nav-link")
  );
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  const sectionIds = navLinks
    .map((link) => link.getAttribute("href") || "")
    .filter((href) => href.startsWith("#"))
    .map((href) => href.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  const observer = new IntersectionObserver(
    (entries) => {
      let mostVisible: IntersectionObserverEntry | null = null;

      for (const entry of entries) {
        if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
          mostVisible = entry;
        }
      }

      if (mostVisible && mostVisible.isIntersecting) {
        const id = mostVisible.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          if (href === `#${id}`) {
            link.classList.add("nav-link--active");
          } else {
            link.classList.remove("nav-link--active");
          }
        });
      }
    },
    {
      threshold: 0.3,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function init() {
  // Ініціалізація базових компонентів
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(".section-root")
  ).map((el) => new Section(el));

  const containers = Array.from(
    document.querySelectorAll<HTMLElement>(".container-root")
  ).map((el) => new Container(el));

  const featureLists = Array.from(
    document.querySelectorAll<HTMLElement>("[data-feature-list]")
  ).map((el) => new FeatureList(el));

  // Кнопки з плавним скролом
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button[data-scroll-to]")
  ).map((btn) => new Button(btn));

  // Використання змінних, щоб TS не вважав їх «невикористаними»
  void sections;
  void containers;
  void featureLists;
  void buttons;

  setupSectionFadeIn();
  setupActiveNavLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

const burger = document.querySelector<HTMLButtonElement>('.burger');
const mobileNav = document.querySelector<HTMLElement>('.mobile-nav');

burger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('is-open');
  burger.classList.toggle('active');
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('is-open');
    burger?.classList.remove('active');
  });
});