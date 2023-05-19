import React from 'react';
import PropTypes from 'prop-types';
const fs = require('fs');

const CSS_PATH = `${process.cwd()}/.next/static/css`;

const PDFLayout = ({ children }: any) => {
  let styleSheets: string[] = [];
  if (fs.existsSync(CSS_PATH)) {
    styleSheets = fs.readdirSync(CSS_PATH);
  }
  return (
    <html>
      <head>
        <meta charSet="utf8" />
        {styleSheets.map((stylesheet: string, idx: number) => 
          <link key={idx} rel="stylesheet" href={`${process.env.PUPPETEER_URL}/_next/static/css/${stylesheet}`} />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
)};

PDFLayout.propTypes = {
  children: PropTypes.node,
};

export default PDFLayout;
