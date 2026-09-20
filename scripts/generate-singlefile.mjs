import fs from 'fs';
import path from 'path';

export function bundleSingleHtml() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const distHtmlPath = path.join(distDir, 'index.html');
  const assetsDir = path.join(distDir, 'assets');
  const publicDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(distHtmlPath) || !fs.existsSync(assetsDir)) {
    console.error('Dist directory not found. Please run vite build first.');
    return;
  }

  let html = fs.readFileSync(distHtmlPath, 'utf8');
  const files = fs.readdirSync(assetsDir);

  let cssContent = '';
  let jsContent = '';

  for (const file of files) {
    const fullPath = path.join(assetsDir, file);
    if (file.endsWith('.css')) {
      cssContent += fs.readFileSync(fullPath, 'utf8') + '\n';
    } else if (file.endsWith('.js')) {
      jsContent += fs.readFileSync(fullPath, 'utf8') + '\n';
    }
  }

  // Replace CSS links with inline <style>
  html = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*"[^>]*>/gi, () => {
    return `<style>\n${cssContent}\n</style>`;
  });

  // Replace JS script tags with inline <script type="module">
  html = html.replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/gi, () => {
    return `<script type="module">\n${jsContent}\n</script>`;
  });

  // Write to dist
  const targetDist = path.join(distDir, 'agenda-surat-sekolah-singlefile.html');
  try {
    fs.writeFileSync(targetDist, html, 'utf8');
  } catch (err) {
    console.warn('Notice: Could not write singlefile to dist:', err);
  }

  // Also write to public so Vite dev server can serve /agenda-surat-sekolah-singlefile.html directly
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const targetPublic = path.join(publicDir, 'agenda-surat-sekolah-singlefile.html');
    fs.writeFileSync(targetPublic, html, 'utf8');
  } catch (err) {
    console.warn('Notice: Could not write singlefile to public (safe to ignore in production):', err);
  }

  console.log(`Standalone HTML file generated at: ${targetDist} (${Math.round(html.length / 1024)} KB)`);
}

bundleSingleHtml();
