const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'utf8');

// Find all Page objects
const pageRegex = /(\d+)\s+0\s+obj[\s\S]*?\/Type\s*\/Page\b([\s\S]*?)endobj/g;
let pageMatch;
let pageNum = 0;

while ((pageMatch = pageRegex.exec(content)) !== null) {
  pageNum++;
  const pageBody = pageMatch[2];
  
  // Find Annots
  const annotsMatch = pageBody.match(/\/Annots\s*\[([^\]]*)\]/);
  if (annotsMatch) {
    const annotRefs = annotsMatch[1].trim().split(/\s+/).filter(Boolean);
    console.log(`Page ${pageNum}: Annots:`, annotRefs.join(' '));
  } else {
    // Check if Annots points to an indirect object like /Annots 15 0 R
    const annotRefMatch = pageBody.match(/\/Annots\s+(\d+\s+\d+\s+R)/);
    if (annotRefMatch) {
      console.log(`Page ${pageNum}: Annots ref:`, annotRefMatch[1]);
    }
  }
}

// Let's find all Annot objects and their Rect and URI
const annotObjRegex = /(\d+)\s+0\s+obj[\s\S]*?\/Subtype\s*\/Link([\s\S]*?)endobj/g;
let annotMatch;
while ((annotMatch = annotObjRegex.exec(content)) !== null) {
  const objNum = annotMatch[1];
  const body = annotMatch[2];
  const rect = body.match(/\/Rect\s*\[([0-9.\s-]+)\]/);
  const uri = body.match(/\/URI\s*\(([^)]+)\)/);
  if (uri) {
    console.log(`Annot Obj ${objNum}: Rect=[${rect ? rect[1].trim() : ''}], URI=${uri[1]}`);
  }
}
