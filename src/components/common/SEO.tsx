import React from 'react';
import { Helmet } from 'react-helmet';


const SEO: React.VFC<SEOProps> = (props) => {
  const title = props.pageTitle ? ` - ${props.pageTitle}` : '';
  const desc = props.ogDescription || 'A BEDROOM PROJECT';

  return (
    <Helmet>
      <title>BEDROOM PROJECTS{title}</title>
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={props.ogImg} />
      <meta property="og:url" content={window.location.href} />
    </Helmet>
  );
};

export type SEOProps = {
  pageTitle?: string;
  ogDescription?: string;
  ogImg: string;
};

export default SEO;
