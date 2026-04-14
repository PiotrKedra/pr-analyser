'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconShare2 } from '@tabler/icons-react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="secondary" onClick={handleCopy}>
      <IconShare2 />
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
