#!/usr/bin/env node

/**
 * AI Image Generator for Blog Posts
 *
 * This script generates AI prompts for blog post thumbnails and cover images,
 * and provides integration hooks for various AI image generation services.
 *
 * Usage:
 * - Generate prompts: node src/scripts/ai-image-generator.js --prompts
 * - Generate with DALL-E: node src/scripts/ai-image-generator.js --dalle
 * - Generate with Midjourney: node src/scripts/ai-image-generator.js --midjourney
 * - Generate with Stable Diffusion: node src/scripts/ai-image-generator.js --stable-diffusion
 */

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { execSync } = require("child_process");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

class AIImageGenerator {
  constructor() {
    this.srcDir = path.join(__dirname, "../..");
    this.contentDir = path.join(this.srcDir, "src", "content", "blog");
    this.promptsDir = path.join(this.srcDir, "src", "scripts", "image-prompts");
    this.publicDir = path.join(this.srcDir, "public");
  }

  async generateAllPrompts() {
    console.log("🤖 Generating AI image prompts for all blog posts...");

    const posts = await this.parseAllPosts();
    const prompts = [];

    for (const post of posts) {
      const imagePrompts = this.generatePostPrompts(post);
      prompts.push(imagePrompts);
    }

    // Save prompts to file
    await this.savePrompts(prompts);

    // Generate placeholder images with prompts
    await this.generatePlaceholderImages(prompts);

    console.log(`✅ Generated prompts for ${prompts.length} posts`);
    return prompts;
  }

  generatePostPrompts(post) {
    const { title, description, slug, tags = [] } = post;

    // Analyze post content for better prompts
    const techStack = this.identifyTechStack(title, description, tags);
    const complexity = this.assessComplexity(description);
    const mood = this.determineMood(description);

    return {
      slug,
      title,
      description,
      thumbnail: {
        prompt: this.createThumbnailPrompt(title, techStack, mood),
        filename: `${slug}-thumbnail.png`,
        size: "400x300",
        style: "minimalist, clean, professional icon",
        techStack,
        mood,
      },
      cover: {
        prompt: this.createCoverPrompt(title, description, techStack, mood),
        filename: `${slug}-cover.jpg`,
        size: "1200x630",
        style: "modern, elegant, high-quality blog cover",
        techStack,
        mood,
        complexity,
      },
    };
  }

  createThumbnailPrompt(title, techStack, mood) {
    const mainSubject = this.extractMainSubject(title);
    const iconElements = techStack
      .slice(0, 2)
      .map((tech) => this.getTechIcon(tech));

    return `Minimalist flat design icon representing ${mainSubject}. ${iconElements.length > 0 ? `Technology elements: ${iconElements.join(", ")}.` : ""} Clean geometric shapes, professional color scheme (blues, greens, or purples), simple light gray background, scalable vector style, no text. Perfect for blog thumbnail. Style: modern tech blog, minimalist, professional.`;
  }

  createCoverPrompt(title, description, techStack, mood) {
    const mainSubject = this.extractMainSubject(title);
    const secondaryElements = this.extractSecondaryElements(description);
    const colorScheme = this.getColorScheme(mood);

    return `Professional blog cover image about "${mainSubject}". Modern ${mood} aesthetic with ${colorScheme} color palette. Clean layout featuring ${techStack.join(" and ")} technologies. ${secondaryElements}. Style: contemporary tech blog, elegant design, professional presentation, soft gradient background, subtle geometric patterns, high-quality digital art, 16:9 aspect ratio, suitable for programming/technology blog.`;
  }

  identifyTechStack(title, description, tags) {
    const allText = (
      title +
      " " +
      description +
      " " +
      (tags || []).join(" ")
    ).toLowerCase();
    const techMap = {
      javascript: [
        "javascript",
        "js",
        "node",
        "react",
        "vue",
        "angular",
        "express",
      ],
      python: ["python", "django", "flask", "pandas", "numpy"],
      css: ["css", "scss", "sass", "tailwind", "bootstrap"],
      html: ["html", "html5", "markup"],
      database: ["database", "sql", "mongodb", "postgresql", "mysql"],
      devops: ["devops", "docker", "kubernetes", "aws", "azure"],
      web: ["web", "frontend", "backend", "fullstack", "api"],
    };

    const identifiedTech = new Set();
    for (const [category, keywords] of Object.entries(techMap)) {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        identifiedTech.add(category);
      }
    }

    return Array.from(identifiedTech);
  }

  assessComplexity(description) {
    const complexityIndicators = {
      high: [
        "advanced",
        "complex",
        "deep dive",
        "comprehensive",
        "architecture",
        "scalability",
      ],
      medium: [
        "guide",
        "tutorial",
        "introduction",
        "building",
        "creating",
        "implementing",
      ],
      low: ["basics", "getting started", "beginner", "simple", "overview"],
    };

    const descLower = description.toLowerCase();
    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some((indicator) => descLower.includes(indicator))) {
        return level;
      }
    }
    return "medium";
  }

  determineMood(description) {
    const moodMap = {
      educational: [
        "learn",
        "guide",
        "tutorial",
        "understand",
        "introduction",
        "concepts",
        "theory",
      ],
      practical: [
        "build",
        "create",
        "implement",
        "develop",
        "practice",
        "example",
        "project",
        "hands-on",
      ],
      analytical: [
        "analysis",
        "comparison",
        "vs",
        "versus",
        "differences",
        "pros",
        "cons",
        "evaluate",
      ],
      inspirational: [
        "tips",
        "tricks",
        "best practices",
        "improve",
        "enhance",
        "optimize",
        "future",
      ],
      technical: [
        "deep dive",
        "advanced",
        "architecture",
        "performance",
        "optimization",
        "algorithms",
      ],
    };

    const descLower = description.toLowerCase();
    for (const [mood, keywords] of Object.entries(moodMap)) {
      if (keywords.some((keyword) => descLower.includes(keyword))) {
        return mood;
      }
    }
    return "educational";
  }

  extractMainSubject(title) {
    const techTerms = [
      "javascript",
      "css",
      "html",
      "react",
      "vue",
      "angular",
      "node",
      "python",
      "web development",
      "programming",
      "coding",
      "software",
      "technology",
      "framework",
      "library",
      "api",
      "database",
      "server",
      "frontend",
      "backend",
      "devops",
    ];

    const titleLower = title.toLowerCase();
    for (const term of techTerms) {
      if (titleLower.includes(term)) {
        return term;
      }
    }

    const words = title.split(" ").filter((word) => word.length > 3);
    return words.slice(0, 2).join(" ");
  }

  extractSecondaryElements(description) {
    const elements = [];

    if (
      description.toLowerCase().includes("code") ||
      description.toLowerCase().includes("example")
    ) {
      elements.push("code snippets or examples");
    }

    if (
      description.toLowerCase().includes("performance") ||
      description.toLowerCase().includes("optimization")
    ) {
      elements.push("performance metrics or optimization techniques");
    }

    if (
      description.toLowerCase().includes("design") ||
      description.toLowerCase().includes("ui")
    ) {
      elements.push("design patterns or UI components");
    }

    return elements.length > 0
      ? `Subtle visual references to ${elements.join(" and ")}`
      : "";
  }

  getColorScheme(mood) {
    const colorSchemes = {
      educational: "blues and whites",
      practical: "greens and grays",
      analytical: "purples and blues",
      inspirational: "warm oranges and yellows",
      technical: "dark blues and accent colors",
    };

    return colorSchemes[mood] || "blues and whites";
  }

  getTechIcon(tech) {
    const icons = {
      javascript: "JavaScript logo or code brackets",
      python: "Python logo or snake icon",
      css: "CSS logo or styling tools",
      html: "HTML logo or markup tags",
      database: "Database cylinder or storage icon",
      devops: "Gear or cloud infrastructure icons",
      web: "Globe or browser window icon",
    };

    return icons[tech] || "Code or technology icon";
  }

  async parseAllPosts() {
    const files = fs
      .readdirSync(this.contentDir)
      .filter((file) => file.endsWith(".md"));
    const posts = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(this.contentDir, file), "utf8");
      const post = this.parsePost(content, file);
      if (post) {
        posts.push(post);
      }
    }

    return posts;
  }

  parsePost(content, filename) {
    const frontmatterMatch = content.match(
      /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/,
    );
    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];

    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const descriptionMatch = frontmatter.match(/description:\s*"([^"]+)"/);
    const slugMatch = frontmatter.match(/slug:\s*"([^"]+)"/);
    const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);

    if (!titleMatch || !descriptionMatch || !slugMatch) return null;

    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((tag) => tag.trim().replace(/"/g, ""))
      : [];

    return {
      title: titleMatch[1],
      description: descriptionMatch[1],
      slug: slugMatch[1],
      tags,
      filename,
    };
  }

  async savePrompts(prompts) {
    if (!fs.existsSync(this.promptsDir)) {
      fs.mkdirSync(this.promptsDir, { recursive: true });
    }

    const promptsFile = path.join(this.promptsDir, "image-prompts.json");
    fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));

    console.log(`📝 Prompts saved to: ${promptsFile}`);
  }

  async generatePlaceholderImages(prompts) {
    console.log("🖼️  Generating placeholder images with AI prompts...");

    for (const postPrompts of prompts) {
      const { slug, thumbnail, cover } = postPrompts;
      const postDir = path.join(this.publicDir, "blog", slug, "images");

      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Create thumbnail placeholder
      const thumbnailPlaceholder = this.createImagePlaceholder(slug, thumbnail);
      await writeFile(
        path.join(postDir, thumbnail.filename),
        thumbnailPlaceholder,
      );

      // Create cover placeholder
      const coverPlaceholder = this.createImagePlaceholder(slug, cover);
      await writeFile(path.join(postDir, cover.filename), coverPlaceholder);

      console.log(`  ✅ ${slug}: thumbnail and cover placeholders created`);
    }
  }

  createImagePlaceholder(slug, imageData) {
    return `# AI Generated Image - ${imageData.filename}
# Blog Post: ${slug}
# Size: ${imageData.size}
# Style: ${imageData.style}
# Tech Stack: ${imageData.techStack.join(", ")}
# Mood: ${imageData.mood}
# Complexity: ${imageData.complexity || "medium"}

# ===== AI GENERATION PROMPT =====
${imageData.prompt}

# ===== INTEGRATION INSTRUCTIONS =====

## For DALL-E Integration:
\`\`\`bash
dalle generate "${imageData.prompt.replace(/"/g, '\\"')}" --size ${imageData.size} --output ${imageData.filename}
\`\`\`

## For Midjourney Integration:
\`\`\`bash
midjourney "${imageData.prompt}" --ar 16:9 --style raw
\`\`\`

## For Stable Diffusion Integration:
\`\`\`bash
python generate.py "${imageData.prompt.replace(/"/g, '\\"')}" --size ${imageData.size} --output ${imageData.filename}
\`\`\`

## Automated Processing:
1. Run this script to generate prompts: node src/scripts/ai-image-generator.js --prompts
2. Use your preferred AI service to generate images
3. Replace these placeholder files with the generated images
4. The blog will automatically use the new images

## Quality Guidelines:
- Images should be professional and tech-related
- Maintain consistent style across all blog images
- Use appropriate colors for the mood and topic
- Ensure images are web-optimized and fast-loading
- Keep file sizes reasonable (thumbnails < 100KB, covers < 500KB)

# Image generated on: ${new Date().toISOString()}
`;
  }

  async generateWithService(service) {
    console.log(`🎨 Generating images with ${service}...`);

    const promptsFile = path.join(this.promptsDir, "image-prompts.json");
    if (!fs.existsSync(promptsFile)) {
      console.log("❌ No prompts found. Run --prompts first.");
      return;
    }

    const prompts = JSON.parse(fs.readFileSync(promptsFile, "utf8"));

    switch (service) {
      case "dalle":
        await this.generateWithDALLE(prompts);
        break;
      case "midjourney":
        await this.generateWithMidjourney(prompts);
        break;
      case "stable-diffusion":
        await this.generateWithStableDiffusion(prompts);
        break;
      default:
        console.log(
          "❌ Unknown service. Use: dalle, midjourney, or stable-diffusion",
        );
    }
  }

  async generateWithDALLE(prompts) {
    console.log("🤖 Generating with DALL-E (simulated)...");

    for (const postPrompts of prompts) {
      const { slug, thumbnail, cover } = postPrompts;
      console.log(`  📝 ${slug}:`);
      console.log(`    Thumbnail: ${thumbnail.prompt.substring(0, 100)}...`);
      console.log(`    Cover: ${cover.prompt.substring(0, 100)}...`);

      // In real implementation, this would call DALL-E API
      // await this.callDALLEAPI(thumbnail.prompt, thumbnail.size, thumbnail.filename);
      // await this.callDALLEAPI(cover.prompt, cover.size, cover.filename);
    }

    console.log(
      "⚠️  DALL-E integration simulated. Install @openai/dall-e for actual implementation.",
    );
  }

  async generateWithMidjourney(prompts) {
    console.log("🎨 Generating with Midjourney (simulated)...");

    for (const postPrompts of prompts) {
      const { slug, thumbnail, cover } = postPrompts;
      console.log(`  📝 ${slug}:`);
      console.log(`    Thumbnail: ${thumbnail.prompt.substring(0, 100)}...`);
      console.log(`    Cover: ${cover.prompt.substring(0, 100)}...`);

      // In real implementation, this would call Midjourney API
      // await this.callMidjourneyAPI(thumbnail.prompt, thumbnail.filename);
      // await this.callMidjourneyAPI(cover.prompt, cover.filename);
    }

    console.log(
      "⚠️  Midjourney integration simulated. Use Discord bot or API for actual implementation.",
    );
  }

  async generateWithStableDiffusion(prompts) {
    console.log("🧪 Generating with Stable Diffusion (simulated)...");

    for (const postPrompts of prompts) {
      const { slug, thumbnail, cover } = postPrompts;
      console.log(`  📝 ${slug}:`);
      console.log(`    Thumbnail: ${thumbnail.prompt.substring(0, 100)}...`);
      console.log(`    Cover: ${cover.prompt.substring(0, 100)}...`);

      // In real implementation, this would call Stable Diffusion
      // await this.callStableDiffusionAPI(thumbnail.prompt, thumbnail.size, thumbnail.filename);
      // await this.callStableDiffusionAPI(cover.prompt, cover.size, cover.filename);
    }

    console.log(
      "⚠️  Stable Diffusion integration simulated. Install diffusers library for actual implementation.",
    );
  }
}

// Command line interface
function main() {
  const generator = new AIImageGenerator();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  node src/scripts/ai-image-generator.js --prompts");
    console.log("  node src/scripts/ai-image-generator.js --dalle");
    console.log("  node src/scripts/ai-image-generator.js --midjourney");
    console.log("  node src/scripts/ai-image-generator.js --stable-diffusion");
    return;
  }

  switch (args[0]) {
    case "--prompts":
      generator.generateAllPrompts().catch(console.error);
      break;
    case "--dalle":
      generator.generateWithService("dalle").catch(console.error);
      break;
    case "--midjourney":
      generator.generateWithService("midjourney").catch(console.error);
      break;
    case "--stable-diffusion":
      generator.generateWithService("stable-diffusion").catch(console.error);
      break;
    default:
      console.log("Unknown command:", args[0]);
  }
}

if (require.main === module) {
  main();
}

module.exports = AIImageGenerator;
