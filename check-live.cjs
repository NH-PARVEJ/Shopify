async function checkLive() {
  try {
    const res = await fetch('https://gt7tbv-26.myshopify.com/');
    console.log('HTTP Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);

    // Check if password protected
    if (html.includes('password') && html.includes('Opening soon')) {
      console.log('SITE IS PASSWORD PROTECTED (Storefront password page)');
    }

    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const images = [];
    while ((match = regex.exec(html)) !== null) {
      images.push(match[1]);
    }

    console.log(`Found ${images.length} images:`);
    for (const img of images) {
      console.log('  Image src:', img);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkLive();
