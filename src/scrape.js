const scrapeSite = () => {
  let markdown = '';

  const htmlTagMappingToMarkdown = {
    '<h1>': '# ',
    '<h2>': '## ',
    '<h3>': '### ',
    '<h4>': '#### ',
    '<h5>': '##### ',
    '<h6>': '###### ',
    '<p>': '',
    '<ul>': '\n',
    '<li>': '- ',
    '<span>': '',
    '</span>': '\n\n',
    '<strong>': '**',
    '<em>': '_',
    '<br>': '\n',
    '<a>': '',
    '<code>': '`',
    '<pre>': '\n```\n',
    '</pre>': '\n```\n',
    '</code>': '`',
    '</a>': '',
    '</img>': '',
    '</strong>': '**',
    '</em>': '_',
    '</li>': '\n',
    '</ul>': '\n',
    '</p>': '\n\n',
    '</h1>': '\n\n',
    '</h2>': '\n\n',
    '</h3>': '\n\n',
    '</h4>': '\n\n',
    '</h5>': '\n\n',
    '</h6>': '\n\n',
    '<mark>': '==',
    '</mark>': '==',
    '<div>': '',
    '</div>': '',
    '<blockquote>': '\n> ',
    '</blockquote>': '\n',
    '<figure>': '\n',
    '</figure>': '\n',
    '<figcaption>': '\n',
    '</figcaption>': '\n',
  };

  const ConvertStringToHTML = function (str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body.innerHTML;
  };

  const removeAttributes = (node) => {
    const attributesRegex = /<([a-z\d]+)([^>]*?\/?)>/gim;

    const withoutAttributes = node.outerHTML.replaceAll(attributesRegex, (fullMatch, tagName, attributes) => {
      if (!attributes.match(/(?:src|href)=".*?"/gim)) {
        return `<${tagName}>`;
      } else {
        const attributeRegex = /(?:src|href)=".*?"/gim;

        const attr = attributes.match(attributeRegex)[0];

        return `<${tagName} ${attr} ${tagName === 'img' ? '/' : ''}>`;
      }
    });

    return withoutAttributes;
  };

  const scrapeContentBlock = (div) => {
    const childNodes = div.childNodes;

    let contentBlock = [];

    const data = childNodes.forEach((node) => {
      contentBlock.push(removeAttributes(node));
    });

    return contentBlock;
  };

  const article = document.querySelector('#root main article section>div');
  const contentDiv = article.children;

  // loop contentDiv
  Array.from(contentDiv).forEach((div, id) => {
    if (id !== 0) {
      if (div.hasAttribute('role')) {
        if (div.getAttribute('role') === 'separator') {
          markdown += '\n---\n\n';
        }
      } else {
        const content = scrapeContentBlock(div);

        // remove all div tags
        const contentWithoutDiv = content.join('').replaceAll('<div>', '').replaceAll('</div>', '');
        // remove all whitespaces between em tags
        const contentWithoutEm = contentWithoutDiv.replaceAll(/<em>(.*?)<\/em>/gim, (fullMatch, content) => {
          const lastCharacter = content.slice(-1);

          if (lastCharacter === ' ') {
            return `<em>${content.trim()}</em> `;
          } else {
            return `<em>${content.trim()}</em>`;
          }
        });

        // remove all whitespaces between strong tags
        const contentWithoutStrong = contentWithoutEm.replaceAll(/<strong>(.*?)<\/strong>/gim, (fullMatch, content) => {
          const lastCharacter = content.slice(-1);

          if (lastCharacter === ' ') {
            return `<strong>${content.trim()}</strong> `;
          } else {
            return `<strong>${content.trim()}</strong>`;
          }
        });

        // get the src links too
        const contentWithReplacedImage = contentWithoutStrong.replaceAll(/<img.*?src="(.*?)".*?>/gim, (fullMatch, content) => {
          return `![](${content})`;
        });

        // get the href links too
        const contentWithReplacedLink = contentWithReplacedImage.replaceAll(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gim, (fullMatch, firstMatch, secondMatch) => {
          return `[${secondMatch}](${firstMatch})`;
        });

        // convert html to markdown using the mapping
        const contentWithMarkdown = contentWithReplacedLink.replaceAll(/<[^>]+>/gim, (fullMatch) => {
          return htmlTagMappingToMarkdown[fullMatch];
        });

        markdown += contentWithMarkdown;
      }
    }
  });

  return markdown;
};
(() => {
  const markdown = scrapeSite();

  //Create a textbox field where we can insert text to.
  var copyFrom = document.createElement('textarea');

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = markdown;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);

  chrome.runtime.sendMessage({
    type: 'send-markdown',
    markdown: markdown,
  });
})();
