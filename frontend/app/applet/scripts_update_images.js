const fs = require('fs');

let content = fs.readFileSync('src/data/products.ts', 'utf8');

const imageMap = {
  'ps-101': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  'ps-102': 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
  'ps-103': 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
  'ps-104': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  'ps-105': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
  'ps-106': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  'ps-107': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
  'ps-108': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  'ps-109': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
  'ps-110': 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80',
  'ps-111': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
  'ps-112': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'ps-113': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'ps-114': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
  'ps-115': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
  'ps-116': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  'ps-117': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
};

for (const [id, url] of Object.entries(imageMap)) {
  const target = `id: '${id}'`;
  const idx = content.indexOf(target);
  if (idx !== -1) {
    const illustStr = 'imageIllustration:';
    const illustIdx = content.indexOf(illustStr, idx);
    if (illustIdx !== -1) {
      const lineEnd = content.indexOf('\n', illustIdx);
      content = content.slice(0, lineEnd) + `,\n    imageUrl: '${url}',` + content.slice(lineEnd + 1);
    }
  }
}

fs.writeFileSync('src/data/products.ts', content);
console.log('Successfully updated products with imageUrl!');
