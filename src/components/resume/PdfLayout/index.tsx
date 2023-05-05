import React from 'react';
import PropTypes from 'prop-types';
const fs = require('fs');

const renderPDFFooter = () => (
  <div
    id="pageFooter"
    style={{
      fontSize: '10px',
      color: '#666'
    }}
  >
    This is a sample footer
  </div>
);

const PDFLayout = ({ children }: any) => {
  // const styleSheetTemplate = `<link rel="stylesheet" href="${process.env.HOST_URL}/static/css/58f174e583f93e15.css" />`
  // let styleSheets: string[] = [];
  let styleSheets: string[] = fs.readdirSync(`${process.cwd()}/.next/static/css`);
  // .forEach((file: string) => {
  //   styleSheets.push(file);
  //   // styleSheets += `<link rel="stylesheet" href="${process.env.HOST_URL}/static/css/${file}" />\n`
  {/* <link rel="stylesheet" href="http://localhost:3000/_next/static/css/58f174e583f93e15.css" />
  <link rel="stylesheet" href="http://localhost:3000/_next/static/css/541b92730d49a442.css" /> */}
  
  {/* <link rel="stylesheet" href="http://localhost:3000/css/resumePdf.module.css" /> */}
  {/* <link rel="stylesheet" href="@/../.next/static/css/58f174e583f93e15.css" />
  <link rel="stylesheet" href="@/../.next/static/css/541b92730d49a442.css" /> */}

  {/* <link rel="stylesheet" href="http://localhost:3000/static/css/58f174e583f93e15.css" />
  <link rel="stylesheet" href="http://localhost:3000/static/css/541b92730d49a442.css" /> */}
  // });
  return (
    <html>
      <head>
        <meta charSet="utf8" />
        {styleSheets.map((stylesheet: string, idx: number) => 
          <link key={idx} rel="stylesheet" href={`${process.env.HOST_URL}/_next/static/css/${stylesheet}`} />
        )}
      </head>
      <body>
        {children}
        {/* {renderPDFFooter()} */}
      </body>
    </html>
)};

PDFLayout.propTypes = {
  children: PropTypes.node,
};

export default PDFLayout;
