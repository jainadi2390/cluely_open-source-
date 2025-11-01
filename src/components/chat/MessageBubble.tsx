import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-br-md shadow-lg shadow-violet-500/20'
            : 'bg-white/5 text-white rounded-bl-md border border-white/10'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="m-0 mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="m-0 mb-2 ml-4 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="m-0 mb-2 ml-4 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ inline, children, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-violet-300"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-white/10 p-3 rounded-md text-sm font-mono overflow-x-auto my-2 text-violet-300"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                pre: ({ children }) => <div className="my-2">{children}</div>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <div
          className={cn(
            'text-xs mt-1 opacity-60',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
