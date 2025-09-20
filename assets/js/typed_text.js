class TypedText {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = options.typeSpeed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseDuration = options.pauseDuration || 2000;
    this.loop = options.loop !== false;

    this.init();
  }

  init() {
    this.element.textContent = "";
    if (this.texts.length > 0) {
      this.type();
    }
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(
        0,
        this.currentCharIndex - 1,
      );
      this.currentCharIndex--;
    } else {
      this.element.textContent = currentText.substring(
        0,
        this.currentCharIndex + 1,
      );
      this.currentCharIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex++;

      if (this.currentTextIndex >= this.texts.length) {
        if (this.loop) {
          this.currentTextIndex = 0;
        } else {
          return;
        }
      }
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize typed text when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const typedElements = document.querySelectorAll("[data-typed-text]");

  typedElements.forEach((element) => {
    const texts = JSON.parse(element.dataset.typedText || "[]");
    const options = JSON.parse(element.dataset.typedOptions || "{}");

    if (texts.length > 0) {
      new TypedText(element, texts, options);
    }
  });
});
