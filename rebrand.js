const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.git', '.expo', 'dist', 'build'].includes(file)) {
                replaceInDir(fullPath);
            }
        } else {
            if (fullPath.match(/\.(tsx|ts|jsx|js|css|html|json)$/)) {
                let content = fs.readFileSync(fullPath, 'utf8');

                // Keep onrender.com backend URL working if they haven't migrated it
                const preserveRenderUrl = content.includes('cuboic-884m.onrender.com');

                let newContent = content
                    .replace(/Onomex/g, 'Onomex')
                    .replace(/onomex(?!_)/g, 'onomex') // avoid changing onomex_backend folder references if any
                    .replace(/logo1\.png/g, 'pic1.png')
                    .replace(/logo\.png/g, 'pic1.png');

                if (preserveRenderUrl) {
                    newContent = newContent.replace(/onomex\.onrender\.com/g, 'cuboic-884m.onrender.com');
                }

                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent);
                    console.log('Updated: ' + fullPath);
                }
            }
        }
    });
}

replaceInDir(path.join(__dirname, 'onomex_customer'));
replaceInDir(path.join(__dirname, 'onomex_admin'));
replaceInDir(path.join(__dirname, 'onomex_mobile'));
replaceInDir(path.join(__dirname, 'onomex_backend'));
console.log('Rebranding complete!');
