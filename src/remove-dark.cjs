const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const oldContent = content;

    // Remove all class names starting with dark:
    content = content.replace(/\s*dark:[a-zA-Z0-9/\[\]\-]+/g, '');

    // Remove the <ThemeToggle /> usage
    content = content.replace(/<ThemeToggle\s*\/>/g, '');

    // Remove the ThemeToggle import line
    content = content.replace(/^import\s+ThemeToggle\s+from\s+['"].+ThemeToggle['"];?\r?\n/gm, '');

    if (oldContent !== content) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
