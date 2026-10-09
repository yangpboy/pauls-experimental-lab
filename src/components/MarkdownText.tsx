import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const externalLinkProps = (href?: string) => href?.startsWith('http')
  ? { target: '_blank', rel: 'noopener noreferrer' }
  : {};

const InlineContainer = ({ children }: { children?: ReactNode }) => <>{children}</>;

const inlineComponents: Components = {
  p: InlineContainer,
  h1: InlineContainer,
  h2: InlineContainer,
  h3: InlineContainer,
  h4: InlineContainer,
  h5: InlineContainer,
  h6: InlineContainer,
  ul: InlineContainer,
  ol: InlineContainer,
  li: InlineContainer,
  blockquote: InlineContainer,
  table: InlineContainer,
  thead: InlineContainer,
  tbody: InlineContainer,
  tr: InlineContainer,
  th: InlineContainer,
  td: InlineContainer,
  hr: () => <span aria-hidden="true"> — </span>,
  br: () => <br />,
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a href={href} {...externalLinkProps(href)} {...props}>{children}</a>
  ),
};

const blockComponents: Components = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a href={href} {...externalLinkProps(href)} {...props}>{children}</a>
  ),
  table: ({ children }) => <div className="my-4 overflow-x-auto"><table>{children}</table></div>,
};

export default function MarkdownText({ children, inline = false, className = '' }: {
  children: string;
  inline?: boolean;
  className?: string;
}) {
  if (!children) return null;

  const content = <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkBreaks]}
    skipHtml
    components={inline ? inlineComponents : blockComponents}
  >
    {children}
  </ReactMarkdown>;

  if (inline) return <span className={`about-markdown-inline ${className}`}>{content}</span>;

  return <div className={`about-markdown-block ${className}`}>
    {content}
  </div>;
}
