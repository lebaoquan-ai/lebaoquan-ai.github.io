#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ImageGenerator {
    constructor() {
        this.srcDir = path.join(__dirname, '../..');
        this.contentDir = path.join(this.srcDir, 'src', 'content', 'blog');
        this.promptsDir = path.join(this.srcDir, 'src', 'scripts', 'image-prompts');
    }

    generateImagePrompts(post) {
        const { title, description, slug } = post;

        // Generate thumbnail prompt (smaller, more focused)
        const thumbnailPrompt = this.createThumbnailPrompt(title, description);

        // Generate cover image prompt (larger, more detailed)
        const coverPrompt = this.createCoverPrompt(title, description);

        return {
            slug,
            thumbnail: {
                prompt: thumbnailPrompt,
                filename: `${slug}-thumbnail.png`,
                size: "400x300",
                style: "minimalist, clean, professional"
            },
            cover: {
                prompt: coverPrompt,
                filename: `${slug}-cover.jpg`,
                size: "1200x630",
                style: "modern, elegant, high-quality"
            }
        };
    }

    createThumbnailPrompt(title, description) {
        const keywords = this.extractKeywords(title + ' ' + description);
        const techKeywords = keywords.filter(k =>
            ['javascript', 'css', 'html', 'react', 'vue', 'angular', 'node', 'python', 'web', 'development'].includes(k.toLowerCase())
        );

        const mainSubject = this.getMainSubject(title);

        return `Minimalist flat design icon representing ${mainSubject}. ${techKeywords.length > 0 ? `Technology theme with elements: ${techKeywords.slice(0, 2).join(', ')}.` : ''} Clean geometric shapes, professional color scheme, simple background, scalable vector style, no text. Perfect for blog thumbnail.`;
    }

    createCoverPrompt(title, description) {
        const keywords = this.extractKeywords(title + ' ' + description);
        const mainSubject = this.getMainSubject(title);
        const mood = this.getMood(description);

        return `Professional blog cover image about "${mainSubject}". Modern ${mood} aesthetic, clean layout, subtle gradients, high-quality digital art, 16:9 aspect ratio. Style: modern tech blog, minimalist design, professional presentation, soft lighting, elegant typography integration, suitable for programming/technology blog.`;
    }

    extractKeywords(text) {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'some', 'any', 'few', 'more', 'most', 'other', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now'];

        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.includes(word))
            .filter((word, index, self) => self.indexOf(word) === index);
    }

    getMainSubject(title) {
        const techTerms = ['javascript', 'css', 'html', 'react', 'vue', 'angular', 'node', 'python', 'web development', 'programming', 'coding', 'software', 'technology', 'framework', 'library', 'api', 'database', 'server', 'frontend', 'backend'];

        const titleLower = title.toLowerCase();
        for (const term of techTerms) {
            if (titleLower.includes(term)) {
                return term;
            }
        }

        // Fallback to first meaningful phrase
        const words = title.split(' ').filter(word => word.length > 3);
        return words.slice(0, 2).join(' ');
    }

    getMood(description) {
        const moods = {
            educational: ['learn', 'guide', 'tutorial', 'understand', 'introduction', 'basics', 'fundamentals'],
            practical: ['build', 'create', 'implement', 'develop', 'practice', 'example', 'project'],
            analytical: ['analysis', 'comparison', 'vs', 'versus', 'differences', 'pros', 'cons'],
            inspirational: ['tips', 'tricks', 'best practices', 'improve', 'enhance', 'optimize'],
            theoretical: ['concepts', 'principles', 'theory', 'foundations', 'deep dive']
        };

        const descLower = description.toLowerCase();

        for (const [mood, keywords] of Object.entries(moods)) {
            if (keywords.some(keyword => descLower.includes(keyword))) {
                return mood;
            }
        }

        return 'educational'; // default mood
    }

    async generatePromptsForAllPosts() {
        const posts = await this.parseAllPosts();
        const prompts = [];

        for (const post of posts) {
            const imagePrompts = this.generateImagePrompts(post);
            prompts.push(imagePrompts);
        }

        return prompts;
    }

    async parseAllPosts() {
        const files = fs.readdirSync(this.contentDir).filter(file => file.endsWith('.md'));
        const posts = [];

        for (const file of files) {
            const content = fs.readFileSync(path.join(this.contentDir, file), 'utf8');
            const post = this.parsePost(content, file);
            if (post) {
                posts.push(post);
            }
        }

        return posts;
    }

    parsePost(content, filename) {
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
        if (!frontmatterMatch) return null;

        const frontmatter = frontmatterMatch[1];
        const body = frontmatterMatch[2];

        const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
        const descriptionMatch = frontmatter.match(/description:\s*"([^"]+)"/);
        const slugMatch = frontmatter.match(/slug:\s*"([^"]+)"/);

        if (!titleMatch || !descriptionMatch || !slugMatch) return null;

        return {
            title: titleMatch[1],
            description: descriptionMatch[1],
            slug: slugMatch[1],
            filename
        };
    }

    async savePrompts() {
        const prompts = await this.generatePromptsForAllPosts();

        if (!fs.existsSync(this.promptsDir)) {
            fs.mkdirSync(this.promptsDir, { recursive: true });
        }

        const promptsFile = path.join(this.promptsDir, 'image-prompts.json');
        fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));

        console.log(`✅ Generated image prompts for ${prompts.length} posts`);
        console.log(`📝 Prompts saved to: ${promptsFile}`);

        return prompts;
    }

    // Utility method to generate placeholder images (for testing)
    generatePlaceholderImage(slug, type = 'thumbnail') {
        const size = type === 'thumbnail' ? '400x300' : '1200x630';
        const filename = `${slug}-${type}.png`;
        const placeholder = `# Placeholder for ${filename}
# Size: ${size}
# Type: ${type}
# AI Prompt: (This will be generated by AI image generation service)

# To generate actual images:
# 1. Use the prompts from image-prompts.json
# 2. Feed them to your preferred AI image generation service (DALL-E, Midjourney, Stable Diffusion)
# 3. Save the generated images to the appropriate post folders

# Example integration commands:
# dalle generate "$(cat image-prompts.json | jq -r '.[0].thumbnail.prompt')" --size ${size} --output ${filename}
# midjourney "$(cat image-prompts.json | jq -r '.[0].cover.prompt)" --ar 16:9
`;

        return placeholder;
    }
}

// Export for use in other modules
module.exports = ImageGenerator;

// Run as standalone script
if (require.main === module) {
    const generator = new ImageGenerator();
    generator.savePrompts().catch(console.error);
}
